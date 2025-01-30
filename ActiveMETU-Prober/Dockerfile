FROM golang:1.20-alpine

WORKDIR /app

# Copy both go.mod and go.sum
COPY go.mod go.sum ./

# Debug
RUN ls -la

RUN go mod download

RUN go mod verify

COPY *.go ./

# Debug
RUN ls -la

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main

# Expose the metrics port
EXPOSE 8080

# Run the prober
CMD ["./main"]
