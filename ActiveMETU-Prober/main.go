package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
)

// ---------------------------------------------------------
// Logrus logger
// ---------------------------------------------------------
var log = logrus.New()

func init() {
	// Configure log format and level (adjust as needed).
	log.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})
	log.SetLevel(logrus.DebugLevel)
}

// ---------------------------------------------------------
// Config and ConfigDuration
// ---------------------------------------------------------

type ConfigDuration time.Duration

func (d *ConfigDuration) UnmarshalJSON(b []byte) error {
	var v interface{}
	if err := json.Unmarshal(b, &v); err != nil {
		return err
	}
	switch value := v.(type) {
	case float64:
		*d = ConfigDuration(time.Duration(value))
		return nil
	case string:
		tmp, err := time.ParseDuration(value)
		if err != nil {
			return err
		}
		*d = ConfigDuration(tmp)
		return nil
	default:
		return fmt.Errorf("invalid duration")
	}
}

func (d ConfigDuration) Duration() time.Duration {
	return time.Duration(d)
}

type Config struct {
	ReadInterval  ConfigDuration    `json:"ReadInterval"`
	WriteInterval ConfigDuration    `json:"WriteInterval"`
	Timeout       ConfigDuration    `json:"Timeout"`
	Endpoints     map[string]string `json:"Endpoints"`
	Port          string            `json:"Port"`
}

func DefaultConfig() *Config {
	return &Config{
		ReadInterval:  ConfigDuration(3 * time.Second),
		WriteInterval: ConfigDuration(30 * time.Second),
		Timeout:       ConfigDuration(10 * time.Second),
		Endpoints: map[string]string{
			"read":  "https://www.activemetu.com",
			"write": "https://www.activemetu.com",
		},
		Port: ":8080",
	}
}

// ---------------------------------------------------------
// DynamicConfig (hot-reload)
// ---------------------------------------------------------

type DynamicConfig struct {
	sync.RWMutex
	*Config
	configPath string
	watcher    *fsnotify.Watcher
	callbacks  []func(*Config)
}

func NewDynamicConfig(configPath string) (*DynamicConfig, error) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return nil, fmt.Errorf("failed to create watcher: %v", err)
	}

	dc := &DynamicConfig{
		Config:     DefaultConfig(),
		configPath: configPath,
		watcher:    watcher,
		callbacks:  make([]func(*Config), 0),
	}

	if _, err := os.Stat(configPath); err == nil {
		if err := dc.loadConfig(); err != nil {
			log.WithError(err).Warn("Couldn't load config file, using defaults")
		}
	}

	go dc.watchConfig()
	return dc, nil
}

func (dc *DynamicConfig) loadConfig() error {
	dc.Lock()
	defer dc.Unlock()

	data, err := os.ReadFile(dc.configPath)
	if err != nil {
		return fmt.Errorf("failed to read config file: %v", err)
	}

	newConfig := &Config{}
	if err := json.Unmarshal(data, newConfig); err != nil {
		return fmt.Errorf("failed to parse config: %v", err)
	}

	dc.Config = newConfig

	for _, callback := range dc.callbacks {
		callback(newConfig)
	}

	log.WithFields(logrus.Fields{
		"port":      newConfig.Port,
		"endpoints": newConfig.Endpoints,
	}).Info("Configuration reloaded successfully")

	return nil
}

func (dc *DynamicConfig) watchConfig() {
	if err := dc.watcher.Add(filepath.Dir(dc.configPath)); err != nil {
		log.WithError(err).Error("Error watching config directory")
		return
	}

	for {
		select {
		case event, ok := <-dc.watcher.Events:
			if !ok {
				return
			}
			if event.Name == dc.configPath && (event.Op&fsnotify.Write == fsnotify.Write) {
				if err := dc.loadConfig(); err != nil {
					log.WithError(err).Error("Error reloading config")
				}
			}
		case err, ok := <-dc.watcher.Errors:
			if !ok {
				return
			}
			log.WithError(err).Error("Error watching config file")
		}
	}
}

func (dc *DynamicConfig) OnConfigUpdate(callback func(*Config)) {
	dc.Lock()
	defer dc.Unlock()
	dc.callbacks = append(dc.callbacks, callback)
}

func (dc *DynamicConfig) Close() error {
	return dc.watcher.Close()
}

// ---------------------------------------------------------
// Metrics
// ---------------------------------------------------------

type MetricsCollector struct {
	registry          *prometheus.Registry
	probeSentTotal    *prometheus.CounterVec
	probeSuccessTotal *prometheus.CounterVec
	probeFailureTotal *prometheus.CounterVec
	probeLatency      *prometheus.HistogramVec
	responseSize      *prometheus.HistogramVec
	lastProbeStatus   *prometheus.GaugeVec
}

func NewMetricsCollector() *MetricsCollector {
	registry := prometheus.NewRegistry()

	mc := &MetricsCollector{
		registry: registry,
		probeSentTotal: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Name: "probe_sent_total",
				Help: "Total number of probes sent",
			},
			[]string{"type", "endpoint"},
		),
		probeSuccessTotal: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Name: "probe_success_total",
				Help: "Total number of successful probes",
			},
			[]string{"type", "endpoint"},
		),
		probeFailureTotal: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Name: "probe_failure_total",
				Help: "Total number of failed probes",
			},
			[]string{"type", "endpoint", "reason"},
		),
		probeLatency: prometheus.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "probe_latency_seconds",
				Help:    "Latency of probes",
				Buckets: []float64{.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10},
			},
			[]string{"type", "endpoint", "status"},
		),
		responseSize: prometheus.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "probe_response_size_bytes",
				Help:    "Size of probe responses in bytes",
				Buckets: prometheus.ExponentialBuckets(100, 10, 8),
			},
			[]string{"type", "endpoint"},
		),
		lastProbeStatus: prometheus.NewGaugeVec(
			prometheus.GaugeOpts{
				Name: "probe_last_status",
				Help: "Status of last probe (1 for success, 0 for failure)",
			},
			[]string{"type", "endpoint"},
		),
	}

	registry.MustRegister(
		mc.probeSentTotal,
		mc.probeSuccessTotal,
		mc.probeFailureTotal,
		mc.probeLatency,
		mc.responseSize,
		mc.lastProbeStatus,
	)

	return mc
}

// ---------------------------------------------------------
// Prober Interface & Structures
// ---------------------------------------------------------

type ProbeResult struct {
	StatusCode   int
	Latency      time.Duration
	ResponseSize int64
	Error        error
}

type Prober interface {
	Start(context.Context)
	Stop()
	PerformProbe(context.Context) ProbeResult
	Type() string
}

type BaseProber struct {
	self      Prober
	client    *http.Client
	metrics   *MetricsCollector
	endpoint  string
	interval  time.Duration
	stopChan  chan struct{}
	probeType string
}

func (p *BaseProber) recordMetrics(result ProbeResult) {
	labels := prometheus.Labels{"type": p.probeType, "endpoint": p.endpoint}

	p.metrics.probeSentTotal.With(labels).Inc()

	if result.Error != nil {
		p.metrics.probeFailureTotal.With(prometheus.Labels{
			"type":     p.probeType,
			"endpoint": p.endpoint,
			"reason":   result.Error.Error(),
		}).Inc()
		p.metrics.lastProbeStatus.With(labels).Set(0)
		return
	}

	statusLabel := fmt.Sprintf("%d", result.StatusCode)
	p.metrics.probeLatency.With(prometheus.Labels{
		"type":     p.probeType,
		"endpoint": p.endpoint,
		"status":   statusLabel,
	}).Observe(result.Latency.Seconds())

	if result.StatusCode >= 200 && result.StatusCode < 300 {
		p.metrics.probeSuccessTotal.With(labels).Inc()
		p.metrics.lastProbeStatus.With(labels).Set(1)
	} else {
		p.metrics.probeFailureTotal.With(prometheus.Labels{
			"type":     p.probeType,
			"endpoint": p.endpoint,
			"reason":   fmt.Sprintf("HTTP %d", result.StatusCode),
		}).Inc()
		p.metrics.lastProbeStatus.With(labels).Set(0)
	}

	if result.ResponseSize > 0 {
		p.metrics.responseSize.With(labels).Observe(float64(result.ResponseSize))
	}
}

func (p *BaseProber) Start(ctx context.Context) {
	log.WithFields(logrus.Fields{
		"type":     p.probeType,
		"endpoint": p.endpoint,
		"interval": p.interval,
	}).Info("📡 Starting prober")

	ticker := time.NewTicker(p.interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.WithFields(logrus.Fields{
				"type":     p.probeType,
				"endpoint": p.endpoint,
			}).Warn("🛑 Stopping prober (context done)")
			return
		case <-p.stopChan:
			log.WithFields(logrus.Fields{
				"type":     p.probeType,
				"endpoint": p.endpoint,
			}).Warn("🛑 Stopping prober (stop signal)")
			return
		case <-ticker.C:
			result := p.self.PerformProbe(ctx)
			p.recordMetrics(result)
		}
	}
}

func (p *BaseProber) Stop() {
	close(p.stopChan)
}

// ---------------------------------------------------------
// Concrete Probers
// ---------------------------------------------------------

type WriteProber struct {
	*BaseProber
}

func (p *WriteProber) Type() string {
	return "write"
}

func (p *WriteProber) PerformProbe(ctx context.Context) ProbeResult {

	log.WithField("endpoint", p.endpoint).Debug("Performing WRITE probe")

	var resp *http.Response
	var err error
	var lastErr error
	var latency time.Duration
	var retryDelay = 5

	var maxAttempts = 3
	for attempt := 1; attempt <= maxAttempts; attempt++ {
		req, reqErr := http.NewRequestWithContext(ctx, "POST", p.endpoint, nil)
		if reqErr != nil {

			log.WithError(reqErr).Error("Failed to create write request")
			return ProbeResult{Error: reqErr}
		}

		start := time.Now()
		resp, err = p.client.Do(req)
		latency = time.Since(start)

		if err == nil {

			break
		}
		lastErr = err

		log.WithError(err).WithFields(logrus.Fields{
			"endpoint": p.endpoint,
			"attempt":  attempt,
		}).Warn("Write probe request failed, retrying...")

		time.Sleep(time.Duration(retryDelay) * time.Second)
	}

	if lastErr != nil {

		return ProbeResult{Error: lastErr, Latency: latency}
	}

	defer resp.Body.Close()
	bodySize, _ := io.Copy(io.Discard, resp.Body)

	log.WithFields(logrus.Fields{
		"endpoint":   p.endpoint,
		"statusCode": resp.StatusCode,
		"latency":    latency,
		"size":       bodySize,
	}).Info("Write probe completed")

	return ProbeResult{
		StatusCode:   resp.StatusCode,
		Latency:      latency,
		ResponseSize: bodySize,
	}
}

type ReadProber struct {
	*BaseProber
}

func (p *ReadProber) Type() string {
	return "read"
}

func (p *ReadProber) PerformProbe(ctx context.Context) ProbeResult {
	log.WithField("endpoint", p.endpoint).Debug("Performing READ probe")

	var resp *http.Response
	var err error
	var lastErr error
	var latency time.Duration
	var retryDelay = 5

	var maxAttempts = 3
	for attempt := 1; attempt <= maxAttempts; attempt++ {
		req, reqErr := http.NewRequestWithContext(ctx, "GET", p.endpoint, nil)
		if reqErr != nil {
			log.WithError(reqErr).Error("Failed to create read request")
			return ProbeResult{Error: reqErr}
		}

		start := time.Now()
		resp, err = p.client.Do(req)
		latency = time.Since(start)

		if err == nil {
			break
		}
		lastErr = err
		log.WithError(err).WithFields(logrus.Fields{
			"endpoint": p.endpoint,
			"attempt":  attempt,
		}).Warn("Read probe request failed, retrying...")

		time.Sleep(time.Duration(retryDelay) * time.Second)
	}

	if lastErr != nil {
		return ProbeResult{Error: lastErr, Latency: latency}
	}

	defer resp.Body.Close()
	bodySize, _ := io.Copy(io.Discard, resp.Body)

	log.WithFields(logrus.Fields{
		"endpoint":   p.endpoint,
		"statusCode": resp.StatusCode,
		"latency":    latency,
		"size":       bodySize,
	}).Info("Read probe completed")

	return ProbeResult{
		StatusCode:   resp.StatusCode,
		Latency:      latency,
		ResponseSize: bodySize,
	}
}

// ---------------------------------------------------------
// Prober Factory
// ---------------------------------------------------------

func NewProber(probeType string, config *Config, metrics *MetricsCollector) Prober {
	base := &BaseProber{
		client: &http.Client{
			Timeout: config.Timeout.Duration(),
			Transport: &http.Transport{
				MaxIdleConns:       100,
				IdleConnTimeout:    90 * time.Second,
				DisableCompression: true,
			},
		},
		metrics:  metrics,
		endpoint: config.Endpoints[probeType],
		stopChan: make(chan struct{}),
	}

	switch probeType {
	case "write":
		base.probeType = "write"
		base.interval = config.WriteInterval.Duration()
		wp := &WriteProber{BaseProber: base}
		base.self = wp
		return wp
	default:
		base.probeType = "read"
		base.interval = config.ReadInterval.Duration()
		rp := &ReadProber{BaseProber: base}
		base.self = rp
		return rp
	}
}

// ---------------------------------------------------------
// ProbeManager
// ---------------------------------------------------------

type ProbeManager struct {
	probers map[string]Prober
	wg      sync.WaitGroup
	ctx     context.Context
	cancel  context.CancelFunc
	metrics *MetricsCollector
	sync.Mutex
}

func NewProbeManager(metrics *MetricsCollector) *ProbeManager {
	ctx, cancel := context.WithCancel(context.Background())
	return &ProbeManager{
		probers: make(map[string]Prober),
		ctx:     ctx,
		cancel:  cancel,
		metrics: metrics,
	}
}

func (pm *ProbeManager) AddProber(p Prober) {
	pm.Lock()
	defer pm.Unlock()
	pm.probers[p.Type()] = p
}

func (pm *ProbeManager) UpdateConfig(config *Config) {
	pm.Lock()
	defer pm.Unlock()

	for _, p := range pm.probers {
		p.Stop()
	}

	pm.probers = make(map[string]Prober)

	for probeType := range config.Endpoints {
		pm.probers[probeType] = NewProber(probeType, config, pm.metrics)
	}

	for _, p := range pm.probers {
		pm.wg.Add(1)
		go func(prober Prober) {
			defer pm.wg.Done()
			prober.Start(pm.ctx)
		}(p)
	}
}

func (pm *ProbeManager) Start() {
	pm.Lock()
	defer pm.Unlock()

	for _, p := range pm.probers {
		pm.wg.Add(1)
		go func(prober Prober) {
			defer pm.wg.Done()
			prober.Start(pm.ctx)
		}(p)
	}
}

func (pm *ProbeManager) Stop() {
	pm.cancel()
	for _, p := range pm.probers {
		p.Stop()
	}
	pm.wg.Wait()
}

// ---------------------------------------------------------
// main
// ---------------------------------------------------------

func main() {
	configPath := "config.json"

	dynamicConfig, err := NewDynamicConfig(configPath)
	if err != nil {
		log.WithError(err).Fatal("Failed to initialize dynamic config")
	}
	defer func() {
		if err := dynamicConfig.Close(); err != nil {
			log.WithError(err).Warn("Failed to close config watcher")
		}
	}()

	metrics := NewMetricsCollector()
	manager := NewProbeManager(metrics)

	dynamicConfig.OnConfigUpdate(func(config *Config) {
		log.Info("Configuration update detected, applying changes...")
		manager.UpdateConfig(config)
	})

	for probeType := range dynamicConfig.Endpoints {
		manager.AddProber(NewProber(probeType, dynamicConfig.Config, metrics))
	}

	http.Handle("/metrics", promhttp.HandlerFor(metrics.registry, promhttp.HandlerOpts{}))

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "healthy")
	})

	go func() {
		log.WithField("port", dynamicConfig.Port).Info("Starting HTTP server for metrics and health")
		if err := http.ListenAndServe(dynamicConfig.Port, nil); err != nil {
			log.WithError(err).Fatal("Failed to start HTTP server")
		}
	}()

	log.WithFields(logrus.Fields{
		"configFile": configPath,
		"port":       dynamicConfig.Port,
	}).Info("Prober started, configuration hot reload enabled")

	manager.Start()

	select {}
}
