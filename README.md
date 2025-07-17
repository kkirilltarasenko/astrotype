# Astrotype

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-%3E=18.0.0-green?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" />
</p>

---

## 🚀 Astrotype - the TypeScript CLI Toolkit

A modern, extensible CLI application built with TypeScript. Includes:

- **API Fetcher**: Batch process YAML-defined API endpoints with worker threads
- **Gemini AI**: Interact with Google Gemini AI directly from your terminal
- Modular command/flag system, colorized output, and easy extensibility

---

## 📦 Installation

```bash
# Clone the repository
$ git clone https://github.com/your-username/astrotype.git
$ cd astrotype

# Install dependencies (using pnpm recommended)
$ pnpm install
```

---

## 🛠️ Usage

Run the SDK with Node.js and ts-node:

```bash
npx ts-node src/index.ts <command> [flags]
```

Or build and run:

```bash
pnpm build
pnpm start <command> [flags]
```

---

## 📋 Command Reference

| Command    | Description                                              | Example Usage                                        |
| ---------- | -------------------------------------------------------- | ---------------------------------------------------- |
| `api-test` | Process all YAML API files in `/api` with worker threads | `npx ts-node src/index.ts api-test`                  |
| `gemini`   | Ask Google Gemini AI a question (requires `-m` flag)     | `npx ts-node src/index.ts gemini -m="Your question"` |

### Flags

| Flag | Description                      | Example                                         |
| ---- | -------------------------------- | ----------------------------------------------- |
| `-v` | Print CLI version                | `npx ts-node src/index.ts -v`                   |
| `-m` | Message for Gemini AI (required) | `npx ts-node src/index.ts gemini -m="Hello AI"` |

---

## 🧩 Features

### 1. API Fetcher (`api-test`)

- Scans the `/api` directory for `.yaml` files
- Each file should define a list of URLs under a `urls:` key
- Processes each URL in a worker thread and outputs results

**YAML Example (`api/api-fetcher-urls.yaml`):**

```yaml
urls:
  - https://jsonplaceholder.typicode.com/posts
  - https://jsonplaceholder.typicode.com/comments
  - https://jsonplaceholder.typicode.com/users
```

**Run:**

```bash
npx ts-node src/index.ts api-test
```

### 2. Gemini AI (`gemini`)

- Interact with Google Gemini AI from your terminal
- Requires a message via the `-m` flag
- Needs a valid `GOOGLE_API_KEY` in your `.env` file

**Run:**

```bash
npx ts-node src/index.ts gemini -m="What is the weather today?"
```

---

## ⚙️ Environment Variables

- For Gemini AI, create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

---

## 🖌️ Output Example

```bash
$ npx ts-node src/index.ts gemini -m="Tell me a joke."
📨 Sending question [Tell me a joke.]...
Here's a joke: Why did the TypeScript developer stay calm? Because they knew how to handle any type of situation!
```

---

## 🤝 Contributing

Pull requests and issues are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.
