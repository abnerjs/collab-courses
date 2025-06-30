module.exports = {
	apps: [
		{
			name: "collab-server",
			script: "dist/src/api/server.js",
			env: {
				NODE_ENV: "production",
				DATABASE_URL:
					"postgresql://docker:docker@localhost:5432/collab-courses",
			},
		},
	],
};
