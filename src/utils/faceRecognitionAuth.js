// Biometric / face recognition support has been removed from the application.
// This file remains as a lightweight compatibility shim so any remaining imports
// will not break the app. All functions return neutral values indicating the
// feature is unavailable.

export const isFaceRecognitionSupported = async () => false;
export const isBiometricSupported = isFaceRecognitionSupported;

export const stringToArrayBuffer = (_str) => null;
export const arrayBufferToString = (_buffer) => null;
export const generateCredentialId = () => null;

export const createFaceRecognitionCredential = async () => null;
export const createBiometricCredential = createFaceRecognitionCredential;

export const authenticateWithFaceRecognition = async () => ({ success: false, message: 'Face recognition removed' });
export const authenticateWithBiometric = authenticateWithFaceRecognition;

export const saveFaceRecognitionCredentials = () => false;
export const saveBiometricCredentials = saveFaceRecognitionCredentials;

export const removeFaceRecognitionCredentials = () => {
    try {
        localStorage.removeItem('faceRecognitionCredentials');
        localStorage.removeItem('biometricCredentials');
        return true;
    } catch (e) {
        return false;
    }
};

export const removeBiometricCredentials = removeFaceRecognitionCredentials;

export const hasFaceRecognitionCredentials = () => false;
export const hasBiometricCredentials = hasFaceRecognitionCredentials;

export const getFaceRecognitionCredentials = () => null;
export const getBiometricCredentials = getFaceRecognitionCredentials;

export const validateFaceRecognitionSupport = () => ({ supported: false, message: 'Face recognition removed' });
export const validateBiometricSupport = validateFaceRecognitionSupport;

export const getFaceRecognitionDeviceInfo = () => null;
