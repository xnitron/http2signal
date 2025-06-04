# 📦 Node.js File Upload Server with Signal CLI Integration

Welcome to the **Signal-powered File Drop Station** 🚀

Have you ever wanted to drop a file into a server and *magically* have it delivered via Signal to a list of phone numbers? This Node.js app makes that a reality — like a digital owl post, but for PDFs and spreadsheets.

---

## 🧠 What It Does

This tiny HTTP server listens for `POST` requests with a file and metadata in the query string. It:

1. Accepts a file stream.
2. Saves it into a local `uploads/` directory.
3. Executes a custom Bash script (`signal-send.sh`) to send the file via [Signal CLI](https://github.com/AsamK/signal-cli) to the provided phone numbers.

Yes, it’s that simple — **drag, drop, deliver**.

---

![Preview](assets/preview.png)

