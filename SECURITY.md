# Security Guidelines

Thank you for your interest in Power, a private moderation and utility bot for JayCord. This document outlines important security guidelines to ensure the safe and secure usage of the bot within the JayCord server. Please read and adhere to these guidelines to prevent any potential issues or vulnerabilities.

## Disclaimer
Power is designed specifically for JayCord and may not work correctly in other servers. Using the bot in other servers may result in unintended behavior or potential breaking of features. However, you are allowed to create your own version of the bot by following the contribution guide mentioned below. Adapt the bot to your needs with the necessary steps.

## Contributing
If you would like to contribute to Power or create your own version of the bot, please follow the steps outlined in the contribution guide. This guide will provide you with the necessary instructions and best practices for modifying the bot's codebase.

## Bot Permissions
To ensure the proper functioning and security of Power, please ensure that the bot is granted the following permissions within the JayCord server:
- Read Messages
- Send Messages
- Embed Links
- Manage Messages
- Kick Members
- Ban Members
- Manage Roles
- Manage Channels

## Server Configuration
To maximize the security of Power, implement the following server configuration best practices:
1. Role Hierarchy: Ensure that Power's role is positioned higher in the role hierarchy than the roles it moderates.
2. Restricted Channels: Limit Power's access to sensitive channels.
3. Channel Audit Logs: Enable Discord's channel audit logs to monitor Power's actions.
4. Regular Updates: Keep Power and its dependencies up to date.

## Data Handling
When handling data, follow these guidelines:
1. Data Minimization: Collect and store only necessary data.
2. Secure Storage: Store data securely with encryption and access controls.
3. Data Retention: Regularly review and delete unnecessary or outdated data.
4. User Consent: Obtain consent before storing or processing personal data.

## Third-Party Libraries
When using third-party libraries, follow these guidelines:
1. Library Selection: Use reputable libraries from trusted sources.
2. Version Management: Keep libraries used by Power up to date.
