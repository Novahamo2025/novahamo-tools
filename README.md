# NovaHamo Tools

> **"Free Online Tools for Everyone"**  
> *Your everyday tools for images, PDFs, QR codes, videos, calculations, coding, and more — all in one place.*

---

## 🏢 About NovaHamo Technologies

**NovaHamo Tools** is developed and maintained by **NovaHamo Technologies Pvt. Ltd.**  
- **Official Website:** [https://www.novahamotechnologies.com/](https://www.novahamotechnologies.com/)
- **Inspiration:** Clean hierarchy, accessible cards, and streamlined productivity inspired by high-standard tools like *iLovePDF*, designed with a completely original, modern green branding system.
- **Core Philosophy:** Strictly client-side execution wherever technically feasible. Zero logins, zero subscriptions, zero unnecessary telemetry, and zero remote storage of user data.

---

## 🚀 Key Architectural Highlights

1. **Strict Frontend-Only Architecture**:
   - All document generation, image manipulations, audio processing, canvas computations, and QR creations run **locally inside the user's browser**.
   - No remote backend server, database, user authentication, or mandatory API keys required.
   - User privacy is 100% guaranteed — sensitive documents and media never leave the user's computer.

2. **Full Responsive Design & Theme System**:
   - Modern design tokens with CSS variables supporting instantaneous **Light** and **Dark** themes.
   - Primary Deep Green (`#15803D`) and Secondary Vibrant Green (`#22C55E`) brand accents.
   - Fully fluid desktop, tablet, and mobile layouts with touch-friendly controls.

3. **Production Optimization**:
   - Vite 8 + React 19 architecture with route-level and component-level code-splitting (`lazy()`).
   - Clean production bundle (`npm run build`) in ~2.3 seconds.
   - Single Page App routing configured for Netlify via `public/_redirects` (`/*  /index.html  200`).

---

## 🛠️ Complete Catalog: 10 Categories & 162 Tools

### 1. QR Code Tools (12 Tools)
- **Text to QR Code**: Convert any custom text into a downloadable PNG QR code.
- **URL to QR Code**: Validate and generate QR codes for any website URL.
- **Wi-Fi QR Code**: Connect guests easily with SSID, security type (WPA/WEP), and password escaping.
- **WhatsApp QR Code**: Pre-filled chat starter link (`wa.me`) encoded into QR.
- **vCard Contact QR Code**: Comprehensive vCard 3.0 generator (Name, Phone, Email, Org, Address).
- **Email QR Code**: Formatted `mailto:` QR with preset subject and body.
- **SMS QR Code**: Formatted `sms:` QR with target number and draft text.
- **Location QR Code**: Validated latitude/longitude coordinates rendered as `geo:` QR.
- **UPI Payment QR Code**: Standard NPCI UPI payload (`upi://pay?pa=...`) for instant scanning.
- **PDF Link QR Code**: Convert hosted PDF URLs into direct scannable codes.
- **QR Code Scanner**: Decode uploaded QR images or scan via device webcam using HTML5 QR library.
- **Custom QR Code Designer**: Customize foreground/background colors, error correction levels (L/M/Q/H), sizing, and centered branding icon.

### 2. Image & Photo Tools (25 Tools)
- **Image Resizer**: Exact dimension and aspect-ratio locked scaling.
- **Image Compressor**: Adjustable lossy compression with size preview and savings estimation.
- **Image Cropper**: Custom interactive cropping canvas with preset aspect ratios.
- **Image Background Remover**: Client-side color tolerance transparency extractor with clear privacy disclosure.
- **JPG to PNG / PNG to JPG / WebP Converters**: Universal canvas format transcoders.
- **Image to PDF**: Multi-image batch converter into standard PDF documents.
- **Image Overlay / Watermark**: Stamp custom text or image overlays with opacity and positioning.
- **Multiple Images Combiner**: Sequential horizontal or vertical multi-image stitching.
- **Image Collage Maker**: Grid layouts (2x1, 2x2, 3x3) with border padding and background styling.
- **Photo Size Reducer (KB target)**: Iterative quality/dimension reducer reaching exact target kilobyte thresholds.
- **Passport Photo Maker**: Standard photo dimensions (India, US, EU) on printable canvas sheets.
- **Image Watermark Remover**: Authorized ownership content-aware area filler.
- **Image Blur & Pixelator**: CSS-canvas privacy filters with adjustable radius/pixel sizes.
- **Image Rotator & Flip**: 90°, 180°, 270° and mirror flips.
- **Image Color Picker**: Interactive canvas pixel magnifier with HEX, RGB, and HSL copy buttons.
- **Photo Brightness & Contrast**: Real-time canvas filter enhancement.
- **Image Upscaler**: High-quality canvas bicubic interpolation.
- **HEIC to JPG**: Apple HEIC/HEIF photo decoder to standard JPEG.
- **Image Metadata Remover**: Canvas re-encoding that cleanly strips private EXIF metadata.
- **Bulk Image Resizer**: Batch-process multiple files with ZIP download support.

### 3. PDF & Document Tools (25 Tools)
- **PDF Compressor**: PDF page stream optimization via `pdf-lib`.
- **PDF Merger**: Drag-and-drop sequencing and combining of multiple PDF files.
- **PDF Splitter**: Extract specified page numbers or ranges (e.g., `1-3, 5, 7-10`).
- **PDF to Word (DOCX)**: Extract PDF text streams into editable DOCX format via `docx`.
- **Word to PDF**: Convert `.docx` documents via `mammoth` and `jsPDF`.
- **PDF to JPG**: Render PDF pages into high-resolution images via `pdfjs-dist`.
- **JPG to PDF**: Package image galleries into clean A4 PDF documents.
- **PDF to Excel & Excel to PDF**: Tabular conversion via `xlsx` (SheetJS).
- **PDF Page Rotator**: Rotate specific pages by 90°, 180°, 270°.
- **PDF Password Protector & Unlocker**: Encrypt/decrypt standard PDF security wrappers.
- **PDF Watermark**: Add custom text watermarks with angle and opacity across all pages.
- **PDF Page Numbers**: Automatically inject "Page X of Y" pagination.
- **PDF Page Remover & Reorder**: Delete unwanted pages or re-sequence document flow.
- **PDF Editor & Signature**: Freehand signature pad and text annotation stamp.
- **PDF to Text**: Extract raw textual transcript.
- **HTML to PDF & PDF Cropper**: Direct HTML text rendering and bounding box adjustments.
- **PDF Grayscale & Metadata Cleaner**: Convert to monochrome and erase author/creation tags.
- **PDF Page Extractor & PDF to PPTX**: Isolate key slides and presentation sheets.

### 4. Video & Audio Tools (20 Tools)
- **Video Compressor**: Real-time canvas + MediaRecorder stream encoding with bitrate throttling.
- **Video Trimmer**: Select precise start/end timestamps and export trimmed clips.
- **Video Merger**: Seamlessly concatenate multiple video clips into one output.
- **Video Resizer**: Scale video resolution to 1080p, 720p, 480p, 360p, or custom dimensions.
- **Video Cropper**: Crop videos to 1:1 (Square), 9:16 (Reels/Shorts), 4:3, or 16:9.
- **Video Converter**: Transcode videos between MP4 and WebM formats.
- **MP4 to MP3 / Audio Extractor**: Decode audio tracks directly into studio 16-bit PCM WAV.
- **Video to GIF & Frame Pack**: Extract high-speed frame sequences and downloadable ZIP archives.
- **GIF to MP4**: Convert animated GIF loops into lightweight video containers.
- **Video Speed Changer**: Alter playback rates from 0.25x up to 3.0x speed.
- **Video Rotator**: Rotate videos 90°, 180°, or 270°.
- **Video Mute**: Strip audio tracks for silent web videos.
- **Add Audio to Video**: Merge background music or voiceovers with any video stream.
- **Video Overlay / Watermark**: Stamp logos and watermark graphics over video frames.
- **Video Thumbnail Extractor**: Capture high-resolution still frames at custom intervals.
- **Audio Compressor**: Resample audio via `OfflineAudioContext` (16kHz, 24kHz, 32kHz).
- **Audio Trimmer**: Waveform slice trimming of audio files with millisecond accuracy.
- **Audio Merger**: Combine multiple songs/recordings into one continuous track.
- **MP3 to WAV**: Convert compressed audio files to uncompressed WAV format.
- **Audio Volume Booster**: Amplify or reduce audio gain from 0.2x up to 3.0x boost (+200%).

### 5. Student & Job Tools (15 Tools)
- **Resume Builder**: Multi-section resume generator with real-time preview, print support, and PDF download.
- **ATS Resume Checker**: Match resume text against job descriptions for keyword scoring and recommendations.
- **Signature Size Reducer**: Compress scanned signature images to under 20-50 KB for official portals.
- **CGPA & SGPA Calculators**: Dynamic semester credit/grade point weighting calculators.
- **Percentage & Marks Percentage Calculators**: Accurate percentage change and score calculations.
- **Age Calculator**: Precise years, months, days, and birthday countdown calculator.
- **Attendance Calculator**: Determine exact classes needed to achieve 75% or 85% attendance targets.
- **Typing Speed Test**: 60-second interactive typing test measuring gross WPM and real-time accuracy.
- **Text to PDF & Certificate Maker**: Generate printable completion certificates with decorative borders.

### 6. Calculators & Converters (10 Tools)
- **EMI Calculator**: Monthly amortization, principal breakdown, and interest calculations.
- **SIP Calculator**: Monthly mutual fund growth projections with compound interest formulas.
- **GST Calculator**: Add or extract GST (5%, 12%, 18%, 28%, custom) with CGST/SGST splits.
- **Discount Calculator**: Savings calculation and reverse percentage discount solver.
- **BMI Calculator**: Metric and Imperial Body Mass Index screener with WHO weight categories.
- **Unit Converter**: Multi-unit conversions across Length, Mass, Temperature, Volume, Area, and Speed.
- **Currency Converter**: Manual rate converter with clear disclaimer regarding real-time forex requirements.
- **Date Difference Calculator**: Calculate elapsed days, months, and years between any two calendar dates.
- **Loan Interest Calculator**: Side-by-side Simple vs Compound interest comparisons.
- **Salary Calculator**: Gross CTC to in-hand take-home estimate with PF, HRA, and tax breakdowns.

### 7. Text & Writing Tools (15 Tools)
- **Word & Character Counters**: Live counting of words, characters, sentences, paragraphs, and reading times.
- **Case Converter**: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case.
- **Remove Duplicate Lines**: Eliminate repeat lines with case-sensitive and whitespace trimming options.
- **Remove Extra Spaces**: Collapse excess tabs and whitespace down to clean single spaces.
- **Text Sorter & Reverser**: Alphabetical, line-length, reverse, and shuffle sorting.
- **Find and Replace**: Global search and replace with case sensitivity and regex support.
- **Text to Speech**: Web Speech API audio synthesiser with adjustable voice and pitch controls.
- **Speech to Text**: Real-time microphone dictation using the Web Speech Recognition API.
- **Text Diff Checker**: Side-by-side visual diff highlighting insertions, deletions, and modifications.
- **Lorem Ipsum Generator**: Customizable placeholder dummy text generator.
- **Text to Handwriting**: Handwriting simulation rendering cursive ink onto paper backgrounds.
- **Fancy Unicode Text**: Generate artistic Unicode fonts (Bold, Italic, Monospace, Bubble, Gothic).
- **Markdown to HTML**: Live Markdown previewer and sanitized HTML exporter.

### 8. Social Media & Creator Tools (15 Tools)
- **Instagram Resizer**: Preset dimensions for Posts (1:1, 4:5), Stories (9:16), and Landscape (1.91:1).
- **Instagram Reel Cover Maker**: 1080x1920 cover canvas with title typography.
- **YouTube Thumbnail Resizer & Maker**: 1280x720 canvas with title text and color overlays.
- **Link Shortener / QR Alternative**: Transparent URL handler providing scannable QR alternatives.
- **Text Overlay Image**: Custom typography and caption stamping over photography.
- **Meme Generator**: Classic meme template generator with top/bottom Impact captions.
- **Caption & Hashtag Generators**: Template-based social copy suggestions categorized by niche.
- **Quote Poster Maker**: Clean graphical typography posters ready for sharing.
- **Animated GIF Maker**: Frame sequencer with looping canvas previews.
- **Profile Picture Circular Cropper**: Circular mask cropper for avatars (400x400, 200x200).
- **Social Media Banner Converter**: Platform templates for Twitter Headers, LinkedIn Banners, and Facebook Covers.

### 9. Developer Tools (20 Tools)
- **JSON Formatter & Validator**: Beautifier, tree view, syntax error detector, and minifier.
- **HTML, CSS & JS Minifiers**: Strip comments and collapse whitespace for lightweight web assets.
- **HTML Formatter**: Clean indentation of HTML code structures.
- **Base64 & URL Encoders/Decoders**: Universal cryptographic and URI string encoders.
- **JWT Decoder**: Parse header, payload claims, and expiration timestamps without transmitting secrets.
- **Regex Tester**: Interactive regex engine with real-time match highlighting and capturing group inspection.
- **UUID / GUID Generator**: RFC4122 v4 cryptographically secure unique identifiers.
- **Hash Generator**: In-browser SHA-256, SHA-512, SHA-1, and MD5 string hashing via Web Crypto API.
- **Strong Password Generator**: Customizable character pools (alphanumeric, symbols, ambiguous filter).
- **HTML Color Picker & CSS Gradient Generator**: Linear and radial CSS gradient builder with one-click CSS copy.
- **UNIX Timestamp Converter**: Epoch seconds/milliseconds to human-readable ISO dates.
- **SQL Formatter**: Standardize database queries with keyword capitalization.
- **Live HTML & Markdown Previews**: Sandboxed live render panes.
- **API Response Formatter**: Clean formatting for JSON/XML REST responses.

### 10. Everyday Tools (10 Tools)
- **Stopwatch**: High-precision stopwatch using `performance.now()` with lap timing.
- **Countdown Timer**: Configurable timers with audio alerts.
- **Random Number Generator**: Cryptographically secure integer and decimal generators (`crypto.getRandomValues`).
- **Random Name Picker**: Transparent name drawing with removal options.
- **Dice Roller**: Standard RPG dice support (d4, d6, d8, d10, d12, d20) with roll history.
- **Coin Flipper**: 3D animated coin toss simulation with win/loss probability counters.
- **Online Notepad**: Browser-local autosaving scratchpad (`localStorage`) with word counts.
- **Barcode Generator**: Render CODE128, EAN-13, and UPC barcodes via `jsbarcode`.
- **Barcode Scanner**: Scan and decode barcodes from uploaded images or camera.
- **Internet Latency Estimator**: Ping and jitter estimator with transparent limitation explanations.

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js version 18.0.0 or higher
- npm version 9.0.0 or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/novahamo-tools.git

# Navigate to project directory
cd novahamo-tools

# Install dependencies
npm install
```

### Running Development Server
```bash
npm run dev
```
The development server will start at `http://localhost:5173`.

### Running Automated Test Suite
```bash
npm test
```
Runs the Vitest suite covering category registry, tool integrity, formatting, validation, and math formulas.

### Building for Production
```bash
npm run build
```
Creates an optimized, tree-shaken static bundle in the `dist/` directory.

### Previewing Production Build Locally
```bash
npm run preview
```

---

## 🌐 Netlify Deployment Guide

This project is 100% pre-configured for continuous deployment on **Netlify** via GitHub:

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of NovaHamo Tools"
   git branch -M main
   git remote add origin https://github.com/YOUR_ORGANIZATION/novahamo-tools.git
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Log into [Netlify](https://app.netlify.com/).
   - Click **"Add new site"** -> **"Import an existing project"**.
   - Select **GitHub** and authorize access to your repository.

3. **Verify Build Settings**:
   The included `netlify.toml` automatically configures everything:
   - **Base directory:** *(leave empty)*
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. **Single Page Application Routing**:
   The project includes `public/_redirects` containing:
   ```
   /*    /index.html   200
   ```
   This ensures deep URLs (e.g. `/tools/pdf-compressor` or `/categories/developer`) work directly when loaded or refreshed in the browser.

---

## 🔒 Privacy & Security Commitment

- **Local Execution**: All user documents, audio, videos, and images remain completely inside the browser's sandbox.
- **No Analytics / Telemetry**: No tracking scripts, cookies, or telemetry libraries are injected.
- **Safe Dependencies**: All client libraries are maintained, trusted packages audited against npm vulnerabilities.

---

## 📄 License & Attribution

Developed by **NovaHamo Technologies Pvt. Ltd.**  
Website: [https://www.novahamotechnologies.com/](https://www.novahamotechnologies.com/)  
All rights reserved.
