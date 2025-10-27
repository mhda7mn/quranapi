# Quran API

![Logo](./assets/Logo.png)

## About

Quran API is a RESTful service designed to make it easier for developers to integrate the quran and its information into websites and apps to expand Islam and knowledge.

## Features

- Access surahs and their information
- Access Ayah Information
- Access Tafseer for surahs and ayahs

## Installation

### Prerequisites

- **Node.js** (version 16.x or later)
- **npm** (Node package manager)
- **Cloudflare Wrangler** (for deploying to Cloudflare Pages)

### Steps to install

```bash
git clone https://github.com/quranapicom/quranapi.git
```

- Install dependencies

```bash
cd quran-api
npm install
```

- Run API locally

```bash
npm run dev
```

- To deploy the API to cloudflare

```bash
npm run deploy
```

## API Endpoints

Once the API is up and running you can access the following endpoints

### 1. GET /api/v1/surahs

### 2. GET /api/v1/surahs/:surahnumber

### 3. GET /api/v1/ayahs/:surahnumber/:ayahnumber

### 4. GET /api/v1/juz

### 5. GET /api/v1/juz/:juznumber

### 6. GET /api/v1/hizb

### 7. GET /api/v1/hizb/:hizbnumber

### 8. GET /api/v1/pages

### 9. GET /api/v1/pages/:pagenumber

### 10. GET /api/v1/tafseer/:surahnumber

### 11. GET /api/v1/tafseer/:surahbnumber/:ayahnumber
