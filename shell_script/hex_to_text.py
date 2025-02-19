# Hexadecimal string with '0x' prefix
hex_value = "0x56696b6173204e616d616c61"

# Remove the '0x' prefix
hex_value = hex_value[2:]

# Convert the hex string to bytes
byte_value = bytes.fromhex(hex_value)

# Decode the bytes to a string
text_value = byte_value.decode('utf-8')

print(text_value)
