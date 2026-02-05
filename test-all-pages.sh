#!/bin/bash

pages=(
  "v2-users-groups.html"
  "v2-my-profile.html"
  "v2-my-profile-multi.html"
  "v2-user-roles.html"
  "v2-user-roles-multi.html"
  "v2-subscription-overview.html"
  "v2-subscription-overview-multi.html"
  "v2-company-overview.html"
  "subscription-detail-landing.html"
)

echo "Testing ${#pages[@]} pages..."
echo ""

for page in "${pages[@]}"; do
  echo "✓ Testing $page..."
  node test-with-report.js "$page"
  echo ""
done

echo "All done! Check your browser for reports."
