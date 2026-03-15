import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useLanguage } from './LangContext';

const User= () => {
    const { token } = useContext(AuthContext);
    const { lang } = useLanguage();
    const [user, setUser] = useState(null);

    const t = {
        en: { profile: "My Eco-Profile", privacy: "Privacy Statement", email: "Email", joined: "Nature Guardian Since", mobileno: "Phone", name: "Name", dm: "Your survey responses are used solely to calculate your carbon impact and provide personalized coaching tips.", trans: "We do not sell your data to third parties. All ML calculations are processed securely through our dedicated Trained model.", c:"You can request data deletion at any time by contacting our support team."},
        hi: { profile: "मेरी प्रोफाइल", privacy: "गोपनीयता नीति", email: "ईमेल", joined: "जुड़ने की तिथि", mobileno: "फ़ोन", name: "नाम", dm: "आपकी सर्वेक्षण प्रतिक्रियाओं का उपयोग पूरी तरह से आपके कार्बन प्रभाव की गणना करने और व्यक्तिगत कोचिंग युक्तियाँ प्रदान करने के लिए किया जाता है।", trans: "हम आपका डेटा तीसरे पक्ष को नहीं बेचते हैं। सभी एमएल गणनाओं को हमारे समर्पित प्रशिक्षित मॉडल के माध्यम से सुरक्षित रूप से संसाधित किया जाता है।", c:"आप हमारी सहायता टीम से संपर्क करके किसी भी समय डेटा हटाने का अनुरोध कर सकते हैं।"}
    }[lang];

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/profile`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setUser(data));
    }, [token]);

    return (
        <div style={containerStyle}>
            {/* User Data Card */}
            <div style={glassCard}>
                <h2 style={{ color: '#1b5e20' }}>{t.profile}</h2>
                {user && (
                    <div >
                        <p><strong>{t.name}:</strong> {user.name?.toUpperCase()}</p>
                        <p><strong>{t.email}:</strong> {user.username}</p>
                        <p><strong>{t.mobileno}:</strong> {user.mobileno}</p>
                        <p><strong>{t.joined}:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                )}
            </div>

            {/* Privacy Statement Card */}
            <div style={{ ...glassCard, marginTop: '20px' }}>
                <h3>🛡️ {t.privacy}</h3>
                <div style={privacyScrollBox}>
                    <p><strong>Data Minimization (डेटा न्यूनीकरण):</strong> {t.dm}</p>
                    <p><strong>Transparency (पारदर्शिता):</strong> {t.trans}</p>
                    <p><strong>Control (नियंत्रण):</strong> { t.c}</p>
                </div>
            </div>
        </div>
    );
};

// Styles
const containerStyle = { padding: '40px 10%', minHeight: '100vh' };
const glassCard = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: '30px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
};
const privacyScrollBox = {
    maxHeight: '200px',
    overflowY: 'scroll',
    padding: '10px',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '10px'
};

export default User;