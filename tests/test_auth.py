"""Tests for auth utilities."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from auth.password_utils import hash_password, verify_password
from auth.jwt_handler import create_access_token, decode_token, get_user_id_from_token


def test_password_hash_and_verify():
    plain = "SecurePass123"
    hashed = hash_password(plain)
    assert hashed != plain
    assert verify_password(plain, hashed)


def test_password_wrong_password():
    hashed = hash_password("correct")
    assert not verify_password("wrong", hashed)


def test_create_and_decode_token():
    token = create_access_token({"sub": "user123", "email": "test@example.com"})
    assert isinstance(token, str)
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == "user123"
    assert payload["email"] == "test@example.com"


def test_decode_invalid_token():
    result = decode_token("not.a.valid.token")
    assert result is None


def test_get_user_id_from_token():
    token = create_access_token({"sub": "abc123"})
    uid = get_user_id_from_token(token)
    assert uid == "abc123"
