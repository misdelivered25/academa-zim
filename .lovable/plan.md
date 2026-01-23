

# Plan: Add Terms and Conditions Page

## Overview
Create a new Terms and Conditions page that displays the comprehensive legal document you uploaded. The document includes both Terms and Conditions and an integrated Privacy Policy, covering definitions, data protection, user conduct, liability, and dispute resolution under Zimbabwean law.

## Document Summary
The uploaded PDF contains:
- **Preamble**: Foundation in Zimbabwean law (Constitution, Cyber and Data Protection Act)
- **Section 1**: Definitions & Interpretation
- **Section 2**: Acceptance & Contractual Capacity
- **Section 3**: Ownership, Intellectual Property & Licenses
- **Section 4**: Data Protection & Privacy Rights (integrated policy)
- **Section 5**: User Conduct & Prohibited Acts
- **Section 6**: Liability, Warranty Disclaimers & Indemnity
- **Section 7**: Amendments & Due Process
- **Section 8**: Termination & Suspension
- **Section 9**: Governing Law & Dispute Resolution
- **Contact Information**: HGC Private Limited details

---

## Implementation Steps

### 1. Create Terms and Conditions Page
Create a new page at `src/pages/Terms.tsx` that displays the full legal document with:
- Professional layout matching the site's design
- Table of contents for easy navigation
- Collapsible sections for better readability
- Effective date and last updated date prominently displayed
- Contact information section at the bottom

### 2. Add Route to App
Register the new `/terms` route in `src/App.tsx`

### 3. Update Footer Links
Update the footer in `src/components/Footer.tsx` to:
- Change `#privacy` and `#terms` href links to proper routes
- Link Privacy Policy to `/terms#privacy` (anchor within the terms page since it's integrated)
- Link Terms of Service to `/terms`
- Add Cookie Policy link to `/terms#cookies` or create a section

### 4. Update Signup Page Checkbox Link
Update the signup form to link the "Terms and Conditions" checkbox text to the actual terms page

---

## Technical Details

### File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/Terms.tsx` | Create | New page with full legal document content |
| `src/App.tsx` | Modify | Add `/terms` route |
| `src/components/Footer.tsx` | Modify | Update legal links to use React Router |
| `src/pages/Signup.tsx` | Modify | Link terms checkbox to `/terms` page |

### Page Features
- **Header/Footer**: Consistent with other public pages
- **Sticky Table of Contents**: For easy section navigation on desktop
- **Collapsible Accordion Sections**: Each major section (1-9) expandable/collapsible
- **Print-friendly**: Styled for printing if needed
- **Responsive Design**: Mobile-optimized reading experience
- **Anchor Links**: Deep links for Privacy Policy, Terms, Cookies sections

### Content Structure
```text
┌─────────────────────────────────────────────┐
│  Header                                     │
├─────────────────────────────────────────────┤
│  Hero: "Terms and Conditions & Privacy      │
│         Policy"                             │
│  Effective Date: 23/01/26                   │
├──────────────┬──────────────────────────────┤
│  Table of    │  Preamble                    │
│  Contents    │  ─────────────────────────── │
│  (Sidebar)   │  1. Definitions              │
│              │  ─────────────────────────── │
│  • Preamble  │  2. Acceptance               │
│  • 1. Def... │  ─────────────────────────── │
│  • 2. Acc... │  3. Ownership & IP           │
│  • 3. Own... │  ─────────────────────────── │
│  • 4. Pri... │  4. Data Protection (Privacy)│
│  • 5. Con... │  ─────────────────────────── │
│  • 6. Lia... │  5. User Conduct             │
│  • 7. Ame... │  ─────────────────────────── │
│  • 8. Ter... │  6. Liability                │
│  • 9. Gov... │  ─────────────────────────── │
│  • Contact   │  7. Amendments               │
│              │  ─────────────────────────── │
│              │  8. Termination              │
│              │  ─────────────────────────── │
│              │  9. Governing Law            │
│              │  ─────────────────────────── │
│              │  Contact Information         │
├──────────────┴──────────────────────────────┤
│  Footer                                     │
└─────────────────────────────────────────────┘
```

---

## Notes
- The document references HGC Private Limited as the company, which aligns with the existing branding in the footer and About page
- Contact email: HGCPrivatelimitedzim@gmail.com
- Physical address: 27174 Unit N Extension, Seke, Chitungwiza
- Phone: +263 785 693 657

