import { colors } from "./colors";

export const textStyles = {
  title: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold'
  },
  small_title: {
    fontSize: 16,
    fontWeight: 'bold'
  }
};

export const elements = {
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    marginVertical: 5,
    padding: 30,
    justifyContent: 'space-around',
    height: 180   
  }
}

export const background = {
  color: {
    backgroundColor: colors.background
  }
};

export const align = {
  center: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export const padding = {
  big_padding: {
    padding: 30
  },
  small_padding: {
    padding: 20
  }
}