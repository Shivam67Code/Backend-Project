const defaultRoute = (req, res) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>YouTube Backend Project</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #f0fff4 0%, #d4edda 100%);
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                color: #2d3748;
            }
            .container {
                text-align: center;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                padding: 3rem 2rem;
                border-radius: 16px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                border: 1px solid #d1fae5;
                max-width: 600px;
                width: 90%;
                color: white;
            }
            h1 {
                font-size: 2.25rem;
                font-weight: 700;
                margin-bottom: 1rem;
                color: #ffffff;
                letter-spacing: -0.025em;
            }
            .subtitle {
                font-size: 1.125rem;
                color: #f0fff4;
                margin-bottom: 1rem;
                font-weight: 500;
            }
            .status-message {
                font-size: 1.25rem;
                color: #f0fff4;
                margin-bottom: 2rem;
                font-weight: 600;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                backdrop-filter: blur(10px);
            }
            .emoji {
                font-size: 2rem;
                margin: 0 0.5rem;
            }
            .info {
                background: rgba(255, 255, 255, 0.15);
                padding: 1.5rem;
                border-radius: 12px;
                border-left: 4px solid #ffffff;
                text-align: left;
                backdrop-filter: blur(10px);
            }
            .info-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            .info-item:last-child {
                border-bottom: none;
            }
            .info-label {
                font-weight: 600;
                color: #ffffff;
            }
            .info-value {
                color: #f0fff4;
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: 0.875rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>YouTube Backend API</h1>
            <p class="subtitle">Welcome to the main application</p>
            <div class="status-message">
                <span class="emoji">☘️</span>
                Server is running, relax
                <span class="emoji">😊🌿</span>
            </div>
            <div class="info">
                <div class="info-item">
                    <span class="info-label">Project</span>
                    <span class="info-value">YouTube Backend API</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Author</span>
                    <span class="info-value">Shivam Karn</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Timestamp</span>
                    <span class="info-value">${new Date().toISOString()}</span>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  res.status(200).send(htmlContent);
};

const healthRoute = (req, res) => {
  const uptime = process.uptime();
  const uptimeFormatted = {
    hours: Math.floor(uptime / 3600),
    minutes: Math.floor(uptime % 3600 / 60),
    seconds: Math.floor(uptime % 60)
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>System Health - YouTube Backend Project</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                margin: 0;
                padding: 2rem;
                min-height: 100vh;
                color: #2d3748;
                line-height: 1.6;
            }
            .container {
                max-width: 1000px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                border: 1px solid #e2e8f0;
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem;
                text-align: center;
            }
            .header h1 {
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                letter-spacing: -0.025em;
            }
            .status-badge {
                display: inline-block;
                background: #10b981;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 9999px;
                font-weight: 600;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .content {
                padding: 2rem;
            }
            .section {
                margin-bottom: 2rem;
                background: #f8fafc;
                border-radius: 12px;
                padding: 1.5rem;
                border: 1px solid #e2e8f0;
            }
            .section:last-child {
                margin-bottom: 0;
            }
            .section-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: #1a202c;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #e2e8f0;
            }
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            .info-card {
                background: white;
                padding: 1rem;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
                transition: all 0.2s ease;
            }
            .info-card:hover {
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                transform: translateY(-1px);
            }
            .info-label {
                font-size: 0.875rem;
                font-weight: 500;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .info-value {
                font-size: 1.125rem;
                font-weight: 600;
                color: #1f2937;
                margin-top: 0.25rem;
                font-family: 'Monaco', 'Menlo', monospace;
            }
            .dependencies-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 0.75rem;
                margin-top: 1rem;
            }
            .dependency-item {
                background: white;
                padding: 0.75rem;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: 0.875rem;
                color: #374151;
            }
            .endpoints-list {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
                flex-wrap: wrap;
            }
            .endpoint-item {
                background: white;
                border: 1px solid #d1d5db;
                padding: 0.75rem 1rem;
                border-radius: 6px;
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: 0.875rem;
                color: #374151;
                font-weight: 500;
            }
            .back-link {
                text-align: center;
                margin-top: 2rem;
            }
            .back-button {
                display: inline-block;
                color: #667eea;
                text-decoration: none;
                font-weight: 500;
                padding: 0.75rem 1.5rem;
                border: 2px solid #667eea;
                border-radius: 8px;
                transition: all 0.2s ease;
            }
            .back-button:hover {
                background: #667eea;
                color: white;
                transform: translateY(-1px);
            }
            .description {
                color: #6b7280;
                margin-top: 1rem;
                font-style: italic;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>System Health Check</h1>
                <div class="status-badge">Server Online</div>
                <p style="margin-top: 1rem; opacity: 0.9;">All systems operational</p>
            </div>

            <div class="content">
                <div class="section">
                    <h2 class="section-title">System Information</h2>
                    <div class="info-grid">
                        <div class="info-card">
                            <div class="info-label">Uptime</div>
                            <div class="info-value">${uptimeFormatted.hours}h ${uptimeFormatted.minutes}m ${uptimeFormatted.seconds}s</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Environment</div>
                            <div class="info-value">${process.env.NODE_ENV || "Development"}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Node Version</div>
                            <div class="info-value">${process.version}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Platform</div>
                            <div class="info-value">${process.platform}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Memory Used</div>
                            <div class="info-value">${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Memory Total</div>
                            <div class="info-value">${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2 class="section-title">Project Information</h2>
                    <div class="info-grid">
                        <div class="info-card">
                            <div class="info-label">Project Name</div>
                            <div class="info-value">YouTube Backend Project</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Version</div>
                            <div class="info-value">1.0.0</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Author</div>
                            <div class="info-value">Shivam Karn</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Last Updated</div>
                            <div class="info-value">${new Date().toISOString()}</div>
                        </div>
                    </div>
                    <p class="description">A professional backend project built for learning purposes, following industry best practices.</p>
                </div>

                <div class="section">
                    <h2 class="section-title">Dependencies</h2>
                    <div class="dependencies-grid">
                        <div class="dependency-item">express: ^5.1.0</div>
                        <div class="dependency-item">mongoose: ^8.18.1</div>
                        <div class="dependency-item">mongodb: ^6.20.0</div>
                        <div class="dependency-item">dotenv: ^17.2.2</div>
                        <div class="dependency-item">cors: ^2.8.5</div>
                        <div class="dependency-item">cookie-parser: ^1.4.7</div>
                    </div>
                </div>

                <div class="section">
                    <h2 class="section-title">Available Endpoints</h2>
                    <div class="endpoints-list">
                        <div class="endpoint-item">GET /</div>
                        <div class="endpoint-item">GET /health</div>
                    </div>
                </div>

                <div class="back-link">
                    <a href="/" class="back-button">← Back to Home</a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  res.status(200).send(htmlContent);
}

export { defaultRoute, healthRoute };
export default defaultRoute;