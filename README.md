# ✨ Kliqhub 
<p align="center">
  <img src="kh logo.jpg" alt="Kliqhub logo" width="440" />
</p>
**A free trust-layer scanner.** Drop in an email, domain, phone number, or image, and Kliqhub returns a 0–100 Trust Score built from real security signal, not guesswork.

## 🔎 What it does

Kliqhub checks what you give it against live threat intelligence and tells you how much to trust it:

- **Email** — checked against Have I Been Pwned for known data breaches and public pastes
- **Domain** — checked against VirusTotal's security vendor network and community reputation data
- **Phone** — validated against international format standards and known spam/spoofing patterns
- **Image** — fingerprinted locally with SHA-256 and checked against VirusTotal's malware database, without ever uploading the file itself

Every score is built with a transparent point-deduction engine — no black box, just a running list of exactly what raised or lowered the score.

## 🤖 How it works 

1. You submit a value.
2. Kliqhub checks Supabase first — if this exact value was scanned recently, you get an instant cached result.
3. On a cache miss, it calls the relevant free security API live, scores the result, caches it, and returns it.

This keeps the app fast and keeps free-tier API usage low even under real traffic.

## 💼 Tech stack 

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Supabase** for caching
- **VirusTotal API** and **Have I Been Pwned API** for security intelligence

## 🟢 Status

🚀[Early build — live HERE](https://kliqhub.com/)

[Watch Our YouTube Channel, Your Shield Against Online Threats]([https://youtube.com](https://youtu.be/qqfTEEgqREo?si=ug3fv9W-36Br4PtK))

## 🛠️ Installation & Setup

Follow these steps to run the project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com
    cd kliqhub
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
