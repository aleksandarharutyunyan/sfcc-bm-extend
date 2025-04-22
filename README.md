# SFCC Cartridge: BM Extend

This Salesforce Commerce Cloud (SFCC) Business Manager (BM) cartridge provides additional admin-side functionalities to support custom operational needs.

It includes features such as secure invoice file download via external service integrations, and is designed to be easily extended with other Business Manager tools.

---

## ✨ Key Features

- **Custom controller**: `/Download-Invoice` route with `filename` parameter
- **Dynamic file resolution** using server-side logic
- **Integration with external storage** via LocalServiceRegistry (e.g., Azure)
- **Error handling and logging**
- **Automatic redirect fallback** to a "not found" route
- **Safe content headers** for PDF delivery and download

---

## 📂 Structure

- `controllers/Download.js`: exposes the `Download-Invoice` endpoint
- `scripts/downloadInvoice.js`: handles external file access via custom SFCC service
- Designed to be extended with other BM-focused logic

---

## 🧠 Usage Notes

This module demonstrates:
- How to connect SFCC to external APIs via service registry
- How to implement secure file delivery in Business Manager
- Practical error logging and fallback for better UX

No business-sensitive data, credentials, or real endpoints are included.

---

## 🔒 Disclaimer

This cartridge is shared for demonstration and evaluation purposes only.  
Service names, tokens, and logic are generic and safe to share.

---

## 🙋‍♂️ About the Author

Built by a full-stack e-commerce developer with 20+ years of experience in Magento, Salesforce B2C Commerce (SFCC), and WordPress.  
GitHub profile: [github.com/aleksandarharutyunyan](https://github.com/aleksandarharutyunyan)
