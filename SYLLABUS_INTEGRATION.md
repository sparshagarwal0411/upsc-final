# Syllabus Integration Documentation

## Overview
This document explains how the syllabus links have been integrated into the UPSC examination application.

## Components Created

### 1. PDFViewer Component (`src/components/PDFViewer.tsx`)
- **Purpose**: Displays PDF files within the application using an iframe
- **Features**:
  - Full-screen modal display
  - Loading states with spinner
  - Error handling with fallback options
  - Download functionality
  - Open in new tab option
  - Responsive design with dark mode support

### 2. SyllabusModal Component (`src/components/SyllabusModal.tsx`)
- **Purpose**: Displays syllabus options for each examination
- **Features**:
  - Maps exam IDs to their respective syllabus links
  - Provides multiple viewing options (view, download, open in new tab)
  - Integrates with PDFViewer for in-app viewing
  - Responsive design with dark mode support

## Syllabus Links Integration

The following syllabus links have been integrated based on the provided URLs:

| Exam | Syllabus Link | Description |
|------|---------------|-------------|
| Civil Services (Prelims) | Civil Service Prelims Syllabus | Complete syllabus for Civil Service Preliminary Examination |
| CDS (I) | CDS Syllabus | Syllabus for Combined Defence Services Examination |
| NDA (I) | NDA Syllabus | Complete syllabus for NDA & NA Examination |
| Engineering Services | Engineering Services Syllabus | Syllabus for Engineering Services Examination |
| CAPF | CAPF Syllabus | Syllabus for Central Armed Police Forces |
| NDA (II) | NDA (II) Syllabus | Syllabus for NDA & NA Examination (II) |
| CDS (II) | CDS (II) Syllabus | Syllabus for Combined Defence Services Examination (II) |
| Indian Forest Services | Indian Forest Services Syllabus | Syllabus for Indian Forest Service Preliminary Examination |
| Combined Medical Services | Combined Medical Services Syllabus | Syllabus for Combined Medical Services Examination |

## How It Works

1. **User clicks "Syllabus" button** on any exam card
2. **SyllabusModal opens** showing available syllabus documents for that exam
3. **User can choose** to:
   - View PDF within the application (opens PDFViewer)
   - Download the PDF file
   - Open PDF in a new browser tab
4. **PDFViewer component** handles the in-app PDF display with full functionality

## Key Features

- **In-app PDF viewing**: PDFs open within the site, not in external tabs
- **Multiple viewing options**: View, download, or open in new tab
- **Error handling**: Graceful fallback if PDF cannot be loaded
- **Responsive design**: Works on all device sizes
- **Dark mode support**: Consistent with application theme
- **Loading states**: User feedback during PDF loading

## Technical Implementation

- Uses React hooks for state management
- Implements TypeScript interfaces for type safety
- Integrates with existing Lucide React icons
- Follows the application's design system and styling
- Handles CORS and PDF loading issues gracefully

## Usage

The syllabus functionality is automatically available on the Exams page. Users can:

1. Navigate to the Exams page
2. Find any examination card
3. Click the "Syllabus" button
4. Choose their preferred viewing method
5. Access the official syllabus documents

All PDFs are displayed within the application, providing a seamless user experience without redirecting to external websites.
