// Biometric functionality removed. This file is kept as a shim to avoid breaking
// imports. All functions return neutral values indicating that biometric
// support is unavailable.

export const isBiometricSupported = async () => false;

export const stringToArrayBuffer = (_str) => null;
export const arrayBufferToString = (_buffer) => null;
export const generateCredentialId = () => null;

export const createBiometricCredential = async () => null;

export const authenticateWithBiometric = async () => ({ success: false, message: 'Biometric support removed' });

export const saveBiometricCredentials = () => false;

export const removeBiometricCredentials = () => {
    try {
        localStorage.removeItem('biometricCredentials');
        return true;
    } catch (e) {
        return false;
    }
};

export const hasBiometricCredentials = () => false;

export const getBiometricCredentials = () => null;

export const validateBiometricSupport = () => ({ supported: false, message: 'Biometric support removed' });
