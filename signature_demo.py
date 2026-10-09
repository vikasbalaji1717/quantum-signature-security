
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey
)
from cryptography.exceptions import InvalidSignature

# Generate a private key
private_key = Ed25519PrivateKey.generate()

# Obtain the matching public key
public_key = private_key.public_key()

# Create a document
document = b"My document is authentic."

# Sign the document
signature = private_key.sign(document)

print("Document signed successfully!")

# Verify the original document
try:
    public_key.verify(signature, document)
    print("Original document: VALID")
except InvalidSignature:
    print("Original document: INVALID")

# Change the document
modified_document = b"My document has been changed."

# Verify the modified document
try:
    public_key.verify(signature, modified_document)
    print("Modified document: VALID")
except InvalidSignature:
    print("Modified document: INVALID")
