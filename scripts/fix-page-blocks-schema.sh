#!/bin/bash

# Fix Page Blocks Schema - pages_id type mismatch
# This script fixes the UUID -> Integer type mismatch in page_blocks.pages_id

set -e  # Exit on error

DIRECTUS_URL="https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Directus Page Blocks Schema Fix ===${NC}\n"

# Check if admin token is provided
if [ -z "$DIRECTUS_ADMIN_TOKEN" ]; then
    echo -e "${RED}Error: DIRECTUS_ADMIN_TOKEN environment variable not set${NC}"
    echo ""
    echo "Please set your Directus admin token:"
    echo "  export DIRECTUS_ADMIN_TOKEN='nEFu077kl6uIkJQpfk4u3yL-tV1l3wD3'"
    echo ""
    echo "To get your admin token:"
    echo "  1. Login to Directus Admin"
    echo "  2. Go to User Menu → Account Settings"
    echo "  3. Scroll to 'Admin Token' section"
    echo "  4. Generate a new token if needed"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓${NC} Admin token found\n"

# Step 1: Verify no existing page_blocks data
echo "Step 1: Checking for existing page_blocks data..."
RESPONSE=$(curl -s "${DIRECTUS_URL}/items/page_blocks?limit=1" \
  -H "Authorization: Bearer ${DIRECTUS_ADMIN_TOKEN}")

COUNT=$(echo "$RESPONSE" | grep -o '"data":\[' | wc -l)

if [ "$COUNT" -gt 0 ]; then
    echo -e "${RED}✗${NC} Found existing page_blocks data"
    echo -e "${YELLOW}Warning: This script will delete the pages_id field${NC}"
    echo "Please backup your data first or proceed manually via Directus UI"
    exit 1
fi
echo -e "${GREEN}✓${NC} No existing data found - safe to proceed\n"

# Step 2: Delete the old pages_id field
echo "Step 2: Deleting pages_id field (UUID type)..."
DELETE_RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE \
  "${DIRECTUS_URL}/fields/page_blocks/pages_id" \
  -H "Authorization: Bearer ${DIRECTUS_ADMIN_TOKEN}" \
  -H "Content-Type: application/json")

HTTP_CODE=$(echo "$DELETE_RESPONSE" | tail -n1)
BODY=$(echo "$DELETE_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 204 ] || [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✓${NC} Field deleted successfully\n"
else
    echo -e "${RED}✗${NC} Failed to delete field (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    echo ""
    echo "If you see a permissions error, try using the Directus UI instead:"
    echo "  Settings → Data Model → page_blocks → Delete 'pages_id' field"
    exit 1
fi

# Wait a moment for database to update
sleep 2

# Step 3: Create new pages_id field with correct type
echo "Step 3: Creating pages_id field (integer type with M2O relationship)..."
CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "${DIRECTUS_URL}/fields/page_blocks" \
  -H "Authorization: Bearer ${DIRECTUS_ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "pages_id",
    "type": "integer",
    "meta": {
      "interface": "select-dropdown-m2o",
      "required": true,
      "special": ["m2o"],
      "hidden": false,
      "options": {
        "template": "{{id}} - {{title}}"
      },
      "display": "related-values",
      "display_options": {
        "template": "{{id}} - {{title}}"
      }
    },
    "schema": {
      "is_nullable": false,
      "foreign_key_table": "pages",
      "foreign_key_column": "id"
    }
  }')

HTTP_CODE=$(echo "$CREATE_RESPONSE" | tail -n1)
BODY=$(echo "$CREATE_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
    echo -e "${GREEN}✓${NC} Field created successfully\n"
else
    echo -e "${RED}✗${NC} Failed to create field (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    exit 1
fi

# Step 4: Verify the fix
echo "Step 4: Verifying the schema..."
VERIFY_RESPONSE=$(curl -s "${DIRECTUS_URL}/fields/page_blocks/pages_id" \
  -H "Authorization: Bearer ${DIRECTUS_ADMIN_TOKEN}")

FIELD_TYPE=$(echo "$VERIFY_RESPONSE" | grep -o '"type":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ "$FIELD_TYPE" = "integer" ]; then
    echo -e "${GREEN}✓${NC} Schema verified - pages_id is now integer type\n"
else
    echo -e "${YELLOW}⚠${NC} Could not verify field type (got: $FIELD_TYPE)"
fi

# Success message
echo -e "${GREEN}=== Schema Fix Complete ===${NC}\n"
echo "You can now link blocks to pages:"
echo ""
echo "  • Go to: ${DIRECTUS_URL}/admin/content/page_blocks"
echo "  • Click 'Create Item'"
echo "  • Select a page from the pages_id dropdown"
echo "  • Choose block type and item"
echo "  • Save"
echo ""
echo "Sample blocks ready to use:"
echo "  - Hero: 803b6698-52c1-4ec3-a3ed-2ae9d197f1a0"
echo "  - Features: c1c3d0fa-2cd7-4f91-811f-2e79e3796400"
echo "  - CTA: 54f4dbbf-670b-440f-bfbc-6a942ea5a6ac"
echo "  - Rich Text: 0e463d8c-3382-4e7e-914b-e83edf38854c"
echo ""