/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        port: "",
        pathname: "/img/**",
      },
    ],
  },
  redirects: [
    {
      "source": "/apps/amazona",
      "has": [
        {
          "type": "host",
          "value": "localhost:3000"
        }
      ],
      "destination": "/apps/amazona"
    }
  ]
};

module.exports = nextConfig;
