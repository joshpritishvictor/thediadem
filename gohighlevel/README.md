# GoHighLevel setup

Everything here is configured in the GoHighLevel app, not deployed with the website.

## 1. Website contact form → GoHighLevel

Handled by `api/contact.ts`. See "Contact form" in the main README for the token and environment variables.

New leads arrive tagged `website-lead`. Create a workflow:

- **Trigger:** Contact Tag Added → `website-lead`
- **Actions:** Internal notification to the team · Send email (confirmation to the lead) · Create/update opportunity in your pipeline

## 2. Policy approved → confirmation of insurance email

Sends the "Confirmation of Insurance" email automatically when an advisor marks a policy as approved.

### a. Custom fields

**Settings → Custom Fields → Add Field** (object: Contact, group e.g. "Policy"):

| Field name       | Type        | Merge key (auto-generated)     |
| ---------------- | ----------- | ------------------------------ |
| Policy Type      | Single line | `{{contact.policy_type}}`      |
| Policy Documents | File Upload | `{{contact.policy_documents}}` |

If GoHighLevel generates a different key, update the template to match. You can check a key by clicking the field in the custom fields list.

### b. Email template

1. **Marketing → Emails → Templates → New → Code editor**.
2. Paste the contents of `policy-approval-email.html`.
3. Subject: `Your {{contact.policy_type}} has been approved`.
4. Send yourself a test, then check the logo, button and merge fields.

The logo loads from `https://diademand.co/email/logo.png`. That URL works once the new site is live; until then, upload the logo to **Media Storage** and swap in that URL.

### c. Workflow

**Automation → Workflows → Create workflow → Start from scratch**:

1. **Trigger:** Contact Tag Added → `policy-approved`. Alternatively, use Pipeline Stage Changed → "Policy Approved" if you track policies as opportunities.
2. **Action:** Send Email → template "Policy approved". From name: `{{user.name}}`.
3. **Action:** Remove Tag → `policy-approved`, so the tag can be reused for the client's next policy.
4. Publish.

### d. Using it for each client

1. Open the contact.
2. Fill **Policy Type**, e.g. "Universal Life Policy".
3. Upload the confirmation of transaction and contract summary PDFs to **Policy Documents**.
4. Add the tag `policy-approved`.

The client receives the branded email with a button to their documents.

> Check what the button links to before relying on it. A File Upload merge field normally inserts the file's link, but if you upload two files, test whether the link opens both. If it doesn't, combine them into one PDF or add a second File Upload field and button.
