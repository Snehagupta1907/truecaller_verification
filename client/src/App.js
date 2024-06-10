import React, { useState } from 'react';
import axios from 'axios';

const VerifyMobile = () => {
    const [verificationStarted, setVerificationStarted] = useState(false);
    const [requestId, setRequestId] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [message, setMessage] = useState('');

    const startVerification = () => {
        const uniqueRequestId = generateUniqueId();
        const deepLink = `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${uniqueRequestId}&partnerKey=spy30b67478007fd14087bfe21de6f3853933&partnerName=demo-app&lang=en&privacyUrl=YOUR_PRIVACY_POLICY_URL&termsUrl=YOUR_TERMS_URL&loginPrefix=proceedwith&loginSuffix=verifymobile&ctaPrefix=continuewith&ctaColor=%23f75d34&ctaTextColor=%23ffffff&btnShape=rect&skipOption=useanothermethod&ttl=8000`;

        setRequestId(uniqueRequestId);
        setVerificationStarted(true);
        window.location = deepLink;

        setTimeout(() => {
            if (document.hasFocus()) {
                setMessage('Truecaller app not found. Please use an alternative verification method.');
                setVerificationStarted(false);
            } else {
                // Truecaller app present, start polling for profile data
                pollForProfileData(uniqueRequestId);
            }
        }, 600);
    };

    const pollForProfileData = (requestId) => {
        let pollingCount = 0;
        const maxPollingAttempts = 5;
        const pollingInterval = 3000;

        const intervalId = setInterval(async () => {
            pollingCount++;
            try {
                const response = await axios.get(` https://seven-dodos-lick.loca.lt/profile?requestId=${requestId}`);
                if (response.data.success) {
                    setProfileData(response.data.profile);
                    clearInterval(intervalId);
                } else if (pollingCount >= maxPollingAttempts) {
                    setMessage('Verification failed. Please try again.');
                    clearInterval(intervalId);
                }
            } catch (error) {
              console.log(error,"inside this");
                setMessage('Error fetching profile data.');
                clearInterval(intervalId);
            }
        }, pollingInterval);
    };

    const generateUniqueId = () => {
        return 'xxxxxxx'.replace(/[x]/g, () => {
            return (Math.random() * 36 | 0).toString(36);
        });
    };

    return (
        <div>
            <h2>Verify Mobile Number</h2>
            {!verificationStarted && <button onClick={startVerification}>Start Verification</button>}
            {message && <p>{message}</p>}
            {profileData && (
                <div>
                    <h3>Profile Data</h3>
                    <pre>{JSON.stringify(profileData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default VerifyMobile;