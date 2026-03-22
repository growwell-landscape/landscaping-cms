# Admin Dashboard Guide

This document is written for clients and content editors who will use the admin dashboard.

It explains:

- what each section in the dashboard controls
- what kind of content can be updated
- how to save and publish changes
- how images, languages, and website settings work

## What the dashboard is for

The admin dashboard lets you manage the website without editing code.

From the dashboard, you can update:

- company and website details
- homepage content
- contact information
- SEO details
- theme colors and fonts
- services
- projects
- translations and language settings
- images and media

Admin URL:

- `https://yourdomain.com/admin`

Local development URL:

- `http://localhost:3000/admin`

## How to log in

To access the dashboard, enter the admin password provided by your development team.

Important:

- only users with the password can publish changes
- the password protects both the admin UI and the save/publish API routes

## How the dashboard is organized

The dashboard works with four main editable content files:

- `Site Configuration`
- `Services`
- `Projects`
- `Translations`

You can think of them like this:

- `Site Configuration`: website-wide settings and homepage content
- `Services`: the list of services shown on the website
- `Projects`: the portfolio or completed work section
- `Translations`: text used in different languages

## How saving works

This is the most important workflow to understand.

There are two save steps in the dashboard:

### 1. Local Save

When you click `Local Save` for a section:

- your edits are saved into the dashboard’s pending queue
- they are not live on the website yet
- they are prepared for publishing

### 2. Global Save

When you click `Global Save`:

- all queued changes are published together
- text edits, config updates, image uploads, and image removals can all be included in one publish
- this is the step that makes changes live

Best practice:

1. make your edits
2. click `Local Save` for the section you changed
3. review your queued changes
4. click `Global Save`

## Quick explanation of auto-commit publishing

After `Global Save`, the system publishes the changes for you automatically.

In the live environment, this works by:

- collecting all queued changes
- creating one publish action
- sending those changes to the website repository
- creating a Git commit in the configured branch

You do not need to use Git manually.

For clients, the important part is simply:

- `Local Save` prepares the changes
- `Global Save` publishes the changes

## Dashboard sections in detail

## 1. Site Configuration

This is the main settings area for the entire website.

Inside this section, the dashboard is split into these groups:

- Site Settings
- SEO Settings
- About Us
- Contact Details
- Hero Section
- Theme Settings
- Other Settings

## 1.1 Site Settings

This section controls the basic identity of the website.

Main fields:

- `site.name`: website/brand name
- `site.companyName`: official company name
- `site.tagline`: short brand line
- `site.description`: short company description

### Logo settings

The logo block controls how your brand appears in the header and footer.

Available settings include:

- `logo.type`: image or text
- `logo.displayMode`: whether the logo shows as image only, image with name, or generated with name
- `logo.imageUrl`: uploaded logo image
- `logo.text`: text fallback or brand initials
- `logo.showText`: whether logo text should be visible
- `logo.imageObjectFit`: how the image fits
- `logo.imageBlendMode`: visual blend style
- `logo.imageWidth` and `logo.imageHeight`: desktop size
- `logo.imageMobileWidth` and `logo.imageMobileHeight`: mobile size

Use this section when you want to:

- change the logo
- update the business name
- adjust how the logo appears on desktop and mobile

## 1.2 Language Settings

Language settings are managed inside `Site Configuration`.

This area lets you:

- add a new language
- rename a language label
- choose the default language
- enable or disable languages on the public site
- remove non-English languages

Important rules:

- English (`en`) is always supported
- the default language should be one your team actively maintains
- when a new language is added, the system can prepare translation-ready content structures automatically

What each option means:

- `Default Language`: the primary language for the site
- `Available Languages`: languages visitors can switch to
- `Active Language`: the language you are currently editing in the dashboard

## 1.3 SEO Settings

This section controls how the website appears in Google results, browser tabs, and social sharing.

Main fields:

- `seo.title`: page title used in search and browser tab
- `seo.description`: meta description used by search engines
- `seo.keywords`: keyword list
- `seo.favicon`: site icon
- `seo.ogImage`: social sharing image

Use this section when you want to:

- improve search visibility
- update branding in browser tabs
- control the image shown when links are shared on WhatsApp, LinkedIn, or Facebook

Recommended approach:

- keep titles clear and business-focused
- write natural descriptions, not keyword stuffing
- use a clean square favicon
- use a strong branded image for `ogImage`

## 1.4 About Us

This section controls the website’s About area.

Main fields:

- `about.title`: main heading
- `about.description`: longer body text
- `about.image`: featured image
- `about.ctaText`: call-to-action button text
- `about.ctaLink`: call-to-action button link
- `about.features`: small feature/highlight list

Each feature usually includes:

- `title`
- `description`

Use this section when you want to:

- refresh the business story
- highlight key strengths
- update the About section image

## 1.5 Contact Details

This section controls all major contact details shown across the site.

Main fields:

- `contact.phone`
- `contact.email`
- `contact.address`
- `contact.location.name`
- `contact.location.url`
- `contact.phoneNumbers`
- `contact.emails`
- `contact.addresses`
- `contact.timings`
- `contact.locations`

### WhatsApp settings

WhatsApp fields:

- `contact.whatsapp.number`: WhatsApp number in international format, usually digits only
- `contact.whatsapp.defaultMessage`: default pre-filled message visitors send

### Floating contact widget

This controls the floating quick-contact buttons on the website.

Fields:

- `contact.floatingContact.enabled`
- `contact.floatingContact.showWhatsApp`
- `contact.floatingContact.showEmail`

Use this section when you want to:

- update phone numbers
- change business hours
- change map links
- turn the floating contact shortcuts on or off

## 1.6 Hero Section

This controls the top banner area on the homepage.

Main fields:

- `hero.title`
- `hero.subtitle`
- `hero.description`
- `hero.ctaText`
- `hero.ctaLink`
- `hero.images.desktop`
- `hero.images.mobile`

Use this section when you want to:

- change the first message visitors see
- update the main call-to-action button
- change homepage hero images for desktop and mobile

Recommended content style:

- keep the title short and clear
- keep the subtitle supportive, not repetitive
- use a CTA like `Explore Services`, `Contact Us`, or `Get a Quote`

## 1.7 Theme Settings

This section controls the design system of the website.

It includes:

- colors
- fonts
- visual effects
- custom CSS

### Theme colors

Available color groups include:

- `primary`, `primaryHover`, `primaryForeground`
- `secondary`, `secondaryHover`, `secondaryForeground`
- `background`, `backgroundAlt`
- `foreground`
- `muted`, `mutedForeground`
- `accent`, `accentForeground`
- `border`
- `surface`, `surfaceMuted`, `surfaceElevated`
- `footerBackground`
- `heroText`, `heroMutedText`
- `overlay`, `overlayStrong`
- `success`, `warning`, `danger`, `info`
- `whatsapp`, `whatsappForeground`
- `mapAccent`, `mapAccentForeground`

### Theme fonts

Font groups:

- `heading`
- `body`
- `ui`

### Theme effects

Effects fields:

- `pageHeroGradient`
- `heroImageOverlay`
- `serviceHeroImageOverlay`
- `adminLoginGradient`

### Custom CSS

`theme.customCss` can be used for advanced visual overrides.

Important:

- this should usually be edited only with developer guidance
- incorrect CSS can affect the site layout

Use this section when you want to:

- rebrand the website
- adjust button colors
- update typography
- fine-tune the visual look

## 1.8 Other Settings

This usually contains social media links.

Each social item includes:

- `id`
- `name`
- `icon`
- `url`
- `enabled`

Use this section when you want to:

- update Instagram or other social links
- temporarily hide a social platform without deleting it

## 2. Services

This section controls the services shown on the site.

Each service entry usually includes:

- `id`
- `title`
- `shortDescription`
- `description`
- `features`
- `image`
- `gallery`
- `icon`
- `sortOrder`
- `enabled`

What these fields mean:

- `id`: internal unique name for the service
- `title`: public service title
- `shortDescription`: short summary used in cards or listings
- `description`: full service description
- `features`: bullet-style highlights
- `image`: main image for the service
- `gallery`: extra service images
- `icon`: icon name used in the interface
- `sortOrder`: display order
- `enabled`: whether the service appears publicly

Use this section when you want to:

- add a new service
- remove or disable a service
- reorder services
- update service images or descriptions

Best practices:

- keep titles short
- keep `shortDescription` easy to scan
- use `enabled = false` if you want to hide a service without deleting it
- use `sortOrder` to control the display order

## 3. Projects

This section controls the portfolio or completed works section.

Each project usually includes:

- `id`
- `title`
- `description`
- `category`
- `location`
- `completedDate`
- `image`
- `images`
- `sortOrder`
- `enabled`
- `showGallery`

What these fields mean:

- `title`: project name
- `description`: project summary
- `category`: type of project such as residential or commercial
- `location`: city or area
- `completedDate`: completion year or date
- `image`: main thumbnail/featured image
- `images`: additional gallery images
- `sortOrder`: display order
- `enabled`: whether the project appears publicly
- `showGallery`: whether the gallery should be shown on the site

Use this section when you want to:

- add a completed project
- update portfolio images
- hide older work without deleting it
- change the order of projects on the site

Best practices:

- choose one strong main image
- keep descriptions concise
- use categories consistently
- use `enabled = false` instead of deleting older projects unless necessary

## 4. Translations

This section stores text used across the website in different languages.

Typical translation groups include:

- navigation text
- hero buttons
- service section labels
- project section labels
- contact labels
- footer labels
- service detail labels
- common UI text

Examples of translation groups:

- `nav`
- `hero`
- `services`
- `projects`
- `contact`
- `footer`
- `serviceDetail`
- `common`

Use this section when you want to:

- change wording on buttons and labels
- update translated text
- review site language consistency

Important:

- translations affect interface text across the site
- changing labels here can update wording in many places at once

## How image uploads work

Images can be uploaded directly from the dashboard.

Typical use cases:

- logo image
- hero banner image
- About section image
- service images
- service gallery images
- project images

Important workflow:

1. upload or replace the image
2. click `Local Save`
3. click `Global Save`

If you only upload the image but do not publish, it may remain queued and not fully go live.

## When to disable instead of delete

In many cases, disabling is safer than deleting.

Use `enabled = false` when:

- you want to temporarily hide a service
- you want to hide a project without losing the content
- you may want to reuse the item later

Delete only when:

- the item should be removed permanently
- you are sure the content and media are no longer needed

## Recommended editing workflow for clients

For simple text changes:

1. log in
2. open the correct section
3. update the text
4. click `Local Save`
5. click `Global Save`
6. refresh the website and confirm the result

For image changes:

1. upload or replace the image
2. wait for it to finish preparing
3. click `Local Save`
4. click `Global Save`
5. review the website on desktop and mobile

For adding a new service or project:

1. create the new item
2. fill title, description, and image
3. set `sortOrder`
4. confirm `enabled = true`
5. click `Local Save`
6. click `Global Save`

For changing branding:

1. open `Site Configuration`
2. update logo, company name, colors, and SEO as needed
3. click `Local Save`
4. click `Global Save`
5. review the homepage, services page, and footer

## What happens after publishing

After `Global Save`:

- the system publishes the queued changes
- the website content source is updated
- on the live setup, the repository may receive a new automatic commit
- the hosting platform may redeploy the site depending on branch and deployment settings

For clients, the important part is:

- once `Global Save` finishes successfully, your changes are considered published

## Common mistakes to avoid

- editing a section and forgetting to click `Local Save`
- clicking `Local Save` but forgetting `Global Save`
- uploading images but not publishing them
- deleting content instead of disabling it
- changing many fields at once without reviewing the site afterward
- pasting long SEO keyword lists that feel unnatural

## Suggested review checklist after any update

After publishing, check:

1. homepage
2. services page
3. projects section
4. contact section
5. footer
6. mobile view
7. WhatsApp button and contact links
8. logo and branding

## When to ask the developer team for help

Please contact the developer team if you want to:

- make major layout changes
- add a completely new section to the website
- change advanced theme CSS
- fix broken formatting after a large content paste
- add a new type of content not already supported in the dashboard
- troubleshoot login or publishing errors

## Summary

The dashboard is built so non-technical users can safely manage the site.

The main rule to remember is:

1. edit the content
2. click `Local Save`
3. click `Global Save`

If you follow that flow, most routine website updates will be simple and reliable.
