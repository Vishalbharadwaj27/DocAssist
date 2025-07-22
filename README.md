# DocAssist 🩺💡

## 🏆 Project Overview
**DocAssist** is an AI-powered medical assistant dashboard designed to support healthcare professionals and patients by providing intelligent insights, symptom analysis, and health recommendations. Built for the **Simba GPT: Promptathon**, this project leverages advanced AI models to enhance medical decision-making and patient care.

---

## 🚨 Latest Migration: TypeScript → Beginner-Friendly JavaScript
- **All code is now in JavaScript (.jsx) with clear comments and PropTypes for easy understanding.**
- **TypeScript files have been removed or converted.**
- **Beginner Guide and Conversion Summary**: These files were deleted, but all relevant information is now in this README.
- **Error handling and user feedback** have been improved throughout the app, especially for authentication.
- **Supabase** is now the only backend/auth provider. All configuration is in `src/integrations/supabase/client.js`.

---

## 🚀 Features
- 🏥 **Symptom Analysis** – Get AI-driven insights on symptoms and possible conditions.
- 💊 **Medication Guidance** – Understand drug interactions, dosages, and side effects.
- 📋 **Medical History Tracking** – Maintain and analyze patient health records.
- 🩺 **AI-Powered Diagnosis Assistance** – Support doctors in diagnosing conditions based on symptoms.
- 🔬 **Lab Report Interpretation** – Analyze test results for quick insights.
- 📅 **Appointment Scheduling** – AI-driven reminders and doctor availability tracking.
- 🔐 **Authentication** – Secure login/signup using Supabase.
- 🧑‍💻 **Beginner-Friendly Code** – All components use PropTypes and are heavily commented for learning.

---

## 🏗️ Tech Stack
- **Frontend**: React.js (Vite, JavaScript, JSX, PropTypes)
- **Backend/Auth**: Supabase (hosted, no server code required)
- **AI Model**: Gemini 2.0 Flash (via API)
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel / AWS / Render

---

## 🛠️ Setup Instructions
1. **Clone the repository**
   ```sh
   git clone https://github.com/Vishalbharadwaj27/DocAssist.git
   cd DocAssist
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure Supabase**
   - Go to `src/integrations/supabase/client.js`.
   - Replace `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` with your own [Supabase project credentials](https://app.supabase.com/).
4. **Run the application**
   ```sh
   npm run dev
   ```
   The app will start on [http://localhost:8080](http://localhost:8080)

---

## 🐞 Troubleshooting & Common Issues
- **AuthSessionMissingError / 400 Bad Request**: Make sure you are using the correct Supabase URL and anon/public key. Sign up before logging in.
- **Failed to fetch / net::ERR_NAME_NOT_RESOLVED**: Your Supabase project URL is invalid or not reachable. Double-check your credentials.
- **Multiple Supabase client errors**: Only use the client in `src/integrations/supabase/client.js`.
- **Still stuck?** Open an issue or check the comments in the code for guidance.

---

## 👥 Team Members
- **Venkat** (GitHub: [venkat374](https://github.com/venkat374))
- **Thushar Raj** (GitHub: [thushar-011](https://github.com/thushar-011))
- **Vishal M Bharadwaj** (GitHub: [Vishalbharadwaj27](https://github.com/Vishalbharadwaj27))
- **Spoorti Nayak** (GitHub: [spoorti-nayak](https://github.com/spoorti-nayak))
- **Kruthika Hegde** (GitHub: [kruthika-hegde](https://github.com/kruthika-hegde))

---

## 🏆 Hackathon Contribution
This project was created for the **Simba GPT: Promptathon** hackathon, showcasing how AI can revolutionize medical assistance. 🚀

---

## 🤝 Contributing
We welcome contributions! Feel free to submit issues, feature requests, or pull requests.

---

## 📜 License
MIT License © 2025 Machas United
