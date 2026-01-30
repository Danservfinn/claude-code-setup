#!/usr/bin/env python3
"""
C-Suite - Notion Database Setup
Creates the business operations database structure in Notion.

Usage:
    NOTION_API_TOKEN=... python setup_notion.py <parent_page_id>
"""

import os
import requests
import json
from typing import Dict, Any

# Notion API configuration
NOTION_API_TOKEN = os.environ.get("NOTION_API_TOKEN")
NOTION_VERSION = "2022-06-28"

HEADERS = {
    "Authorization": f"Bearer {NOTION_API_TOKEN}",
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION
}


def create_page(parent_page_id: str, title: str, icon: str = None) -> str:
    """Create a new page and return its ID."""
    url = "https://api.notion.com/v1/pages"

    page_data = {
        "parent": {"page_id": parent_page_id},
        "properties": {
            "title": {
                "title": [
                    {"text": {"content": title}}
                ]
            }
        }
    }

    if icon:
        page_data["icon"] = {"emoji": icon}

    response = requests.post(url, headers=HEADERS, json=page_data)
    response.raise_for_status()
    return response.json()["id"]


def create_database(parent_page_id: str, title: str, icon: str, schema: list) -> str:
    """Create a database and return its ID."""
    url = "https://api.notion.com/v1/databases"

    db_data = {
        "parent": {"page_id": parent_page_id},
        "icon": {"emoji": icon},
        "title": [
            {"type": "text", "text": {"content": title}}
        ],
        "properties": {prop["name"]: prop["config"] for prop in schema}
    }

    response = requests.post(url, headers=HEADERS, json=db_data)

    if response.status_code != 200:
        print(f"Error creating database '{title}': {response.text}")
        return None

    return response.json()["id"]


def get_database_schemas() -> Dict[str, list]:
    """Return database schemas for all Kurultai business databases."""
    return {
        "Tasks & Action Items": [
            {"name": "Name", "config": {"title": {}}},
            {"name": "Status", "config": {
                "select": {
                    "options": [
                        {"name": "Not Started", "color": "gray"},
                        {"name": "In Progress", "color": "blue"},
                        {"name": "Complete", "color": "green"},
                        {"name": "Blocked", "color": "red"}
                    ]
                }
            }},
            {"name": "Priority", "config": {
                "select": {
                    "options": [
                        {"name": "High", "color": "red"},
                        {"name": "Medium", "color": "yellow"},
                        {"name": "Low", "color": "gray"}
                    ]
                }
            }},
            {"name": "Category", "config": {
                "select": {
                    "options": [
                        {"name": "Formation", "color": "brown"},
                        {"name": "Compliance", "color": "orange"},
                        {"name": "Financial", "color": "green"},
                        {"name": "Parse", "color": "blue"},
                        {"name": "General", "color": "gray"}
                    ]
                }
            }},
            {"name": "Due Date", "config": {"date": {}}},
            {"name": "Notes", "config": {"rich_text": {}}}
        ],

        "Documents & Records": [
            {"name": "Name", "config": {"title": {}}},
            {"name": "Document Type", "config": {
                "select": {
                    "options": [
                        {"name": "Formation", "color": "brown"},
                        {"name": "Government", "color": "blue"},
                        {"name": "Tax", "color": "green"},
                        {"name": "Legal", "color": "purple"},
                        {"name": "Financial", "color": "orange"}
                    ]
                }
            }},
            {"name": "File Location", "config": {"files": {}}},
            {"name": "Date Filed", "config": {"date": {}}},
            {"name": "Description", "config": {"rich_text": {}}}
        ],

        "Financial Transactions": [
            {"name": "Name", "config": {"title": {}}},
            {"name": "Type", "config": {
                "select": {
                    "options": [
                        {"name": "Expense", "color": "red"},
                        {"name": "Revenue", "color": "green"},
                        {"name": "Transfer", "color": "blue"}
                    ]
                }
            }},
            {"name": "Amount", "config": {"number": {"format": "dollar"}}},
            {"name": "Category", "config": {
                "select": {
                    "options": [
                        {"name": "Software", "color": "blue"},
                        {"name": "Infrastructure", "color": "purple"},
                        {"name": "Legal", "color": "orange"},
                        {"name": "Tax", "color": "green"},
                        {"name": "Other", "color": "gray"}
                    ]
                }
            }},
            {"name": "Date", "config": {"date": {}}},
            {"name": "Notes", "config": {"rich_text": {}}}
        ],

        "Compliance & Deadlines": [
            {"name": "Name", "config": {"title": {}}},
            {"name": "Deadline", "config": {"date": {}}},
            {"name": "Status", "config": {
                "select": {
                    "options": [
                        {"name": "Upcoming", "color": "gray"},
                        {"name": "Due Soon", "color": "yellow"},
                        {"name": "Overdue", "color": "red"},
                        {"name": "Complete", "color": "green"}
                    ]
                }
            }},
            {"name": "Requirement", "config": {"rich_text": {}}},
            {"name": "Cost", "config": {"number": {"format": "dollar"}}}
        ],

        "Vendors & Partners": [
            {"name": "Name", "config": {"title": {}}},
            {"name": "Type", "config": {
                "select": {
                    "options": [
                        {"name": "Software", "color": "blue"},
                        {"name": "Professional Services", "color": "purple"},
                        {"name": "Banking", "color": "green"},
                        {"name": "Infrastructure", "color": "orange"}
                    ]
                }
            }},
            {"name": "Status", "config": {
                "select": {
                    "options": [
                        {"name": "Active", "color": "green"},
                        {"name": "Inactive", "color": "gray"},
                        {"name": "Prospect", "color": "yellow"}
                    ]
                }
            }},
            {"name": "Contact Info", "config": {"rich_text": {}}},
            {"name": "Notes", "config": {"rich_text": {}}}
        ],

        "Metrics & Reports": [
            {"name": "Name", "config": {"title": {}}},
            {"name": "Date", "config": {"date": {}}},
            {"name": "Metric Type", "config": {
                "select": {
                    "options": [
                        {"name": "Revenue", "color": "green"},
                        {"name": "Expenses", "color": "red"},
                        {"name": "Parse Metrics", "color": "blue"},
                        {"name": "Compliance", "color": "orange"}
                    ]
                }
            }},
            {"name": "Value", "config": {"rich_text": {}}},
            {"name": "Notes", "config": {"rich_text": {}}}
        ]
    }


def setup_kurultai_notion(parent_page_id: str) -> Dict[str, str]:
    """
    Create the complete Kurultai Business Operations structure in Notion.

    Args:
        parent_page_id: The ID of the page where databases will be created

    Returns:
        Dictionary mapping database names to their IDs
    """
    # Create main Kurultai page
    kurultai_page_id = create_page(
        parent_page_id,
        "Kurultai Business Operations",
        "building"
    )
    print(f"Created page: Kurultai Business Operations ({kurultai_page_id})")

    # Get database schemas
    schemas = get_database_schemas()

    # Create each database
    database_ids = {}
    icons = ["clipboard", "page_facing_up", "moneybag", "calendar", "handshake", "chart_with_upwards_trend"]

    for i, (name, schema) in enumerate(schemas.items()):
        db_id = create_database(kurultai_page_id, name, icons[i], schema)
        if db_id:
            database_ids[name] = db_id
            print(f"Created database: {name} ({db_id})")

    # Save configuration
    config = {
        "page_id": kurultai_page_id,
        "databases": database_ids
    }

    return config


def main():
    """Run the Notion setup."""
    import sys

    if not NOTION_API_TOKEN:
        print("ERROR: NOTION_API_TOKEN environment variable is required")
        sys.exit(1)

    if len(sys.argv) < 2:
        print("Usage: NOTION_API_TOKEN=... python setup_notion.py <parent_page_id>")
        print("\nTo get your parent page ID:")
        print("1. Go to your Notion workspace")
        print("2. Create a new page (or use an existing one)")
        print("3. Open the page in your browser")
        print("4. Copy the ID from the URL (the 32-character string)")
        sys.exit(1)

    parent_page_id = sys.argv[1].replace("-", "")

    print("Setting up Kurultai Business Operations in Notion...")
    print(f"Parent page ID: {parent_page_id}\n")

    try:
        config = setup_kurultai_notion(parent_page_id)
        print("\nSetup complete!")
        print("\nDatabase IDs:")
        for name, db_id in config["databases"].items():
            print(f"  {name}: {db_id}")
    except Exception as e:
        print(f"\nError: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
