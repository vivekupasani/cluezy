export type ConnectorProvider =
  | 'gmail'
  | 'google-drive'
  | 'notion'
  | 'google-calendar'
  | 'google-sheets'
  | 'google-docs'
  | 'linear'
  | 'supabase'
  | 'shopify'
  | 'youtube'

export interface ConnectorFeature {
  key: string
  feature: string
  description: string
}

export interface ConnectorConfig {
  name: string
  description: string
  icon: string
  documentLimit: number
  syncTag: string
  features: ConnectorFeature[]
}

export const CONNECTOR_CONFIGS: Record<ConnectorProvider, ConnectorConfig> = {
  gmail: {
    name: 'Gmail',
    description: 'Search, create, and manage your emails',
    icon: 'gmail',
    documentLimit: 5000,
    syncTag: 'gmail',
    features: [
      {
        key: 'GMAIL_BATCH_MODIFY_MESSAGES',
        feature: 'Bulk Modify Messages',
        description:
          'Modify labels on multiple Gmail messages in one efficient API call. Supports up to 1,000 messages per request for bulk operations like archiving, marking as read/unread, or applying custom labels.'
      },
      {
        key: 'GMAIL_CREATE_EMAIL_DRAFT',
        feature: 'Create Email Draft',
        description:
          'Creates a Gmail email draft. All fields are optional per the Gmail API - drafts can be created with minimal content and edited later before sending.'
      },
      {
        key: 'GMAIL_DELETE_DRAFT',
        feature: 'Delete Draft',
        description:
          'Permanently deletes a specific Gmail draft using its ID; ensure the draft exists and the user has necessary permissions.'
      },
      {
        key: 'GMAIL_DELETE_MESSAGE',
        feature: 'Delete Message',
        description:
          'Permanently deletes a specific email message by its ID from a Gmail mailbox.'
      },
      {
        key: 'GMAIL_FETCH_EMAILS',
        feature: 'Fetch Emails',
        description:
          'Fetches a list of email messages from a Gmail account, supporting filtering, pagination, and optional full content retrieval.'
      },
      {
        key: 'GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID',
        feature: 'Fetch Message by ID',
        description:
          'Fetches a specific email message by its ID, provided the message_id exists and is accessible to the authenticated user.'
      },
      {
        key: 'GMAIL_GET_ATTACHMENT',
        feature: 'Get Attachment',
        description:
          "Retrieves a specific attachment by ID from a message in a user's Gmail mailbox, requiring valid message and attachment IDs."
      },
      {
        key: 'GMAIL_GET_DRAFT',
        feature: 'Get Draft',
        description:
          'Retrieves a single Gmail draft by its ID. Use this to fetch and inspect draft content before sending.'
      },
      {
        key: 'GMAIL_LIST_DRAFTS',
        feature: 'List Drafts',
        description:
          "Retrieves a paginated list of email drafts from a user's Gmail account."
      },
      {
        key: 'GMAIL_MOVE_TO_TRASH',
        feature: 'Move to Trash',
        description:
          'Moves an existing, non-deleted email message to the trash for the specified user.'
      },
      {
        key: 'GMAIL_PATCH_LABEL',
        feature: 'Patch Label',
        description: 'Patches the specified label in Gmail.'
      },
      {
        key: 'GMAIL_REPLY_TO_THREAD',
        feature: 'Reply to Thread',
        description:
          "Sends a reply within a specific Gmail thread using the original thread's subject, requiring a valid thread_id."
      },
      {
        key: 'GMAIL_SEARCH_PEOPLE',
        feature: 'Search Contacts',
        description:
          'Searches contacts by matching the query against names, nicknames, emails, phone numbers, and organizations.'
      },
      {
        key: 'GMAIL_SEND_DRAFT',
        feature: 'Send Draft',
        description:
          'Sends an existing draft email AS-IS to recipients already defined within the draft.'
      },
      {
        key: 'GMAIL_SEND_EMAIL',
        feature: 'Send Email',
        description:
          "Sends an email via Gmail API using the authenticated user's Google profile display name."
      },
      {
        key: 'GMAIL_UPDATE_DRAFT',
        feature: 'Update Draft',
        description:
          "Updates (replaces) an existing Gmail draft's content in-place by draft ID."
      }
    ]
  },
  'google-drive': {
    name: 'Google Drive',
    description:
      'Search through documents, spreadsheets, and presentations from Google Drive',
    icon: 'google-drive',
    documentLimit: 3000,
    syncTag: 'googledrive',
    features: [
      {
        key: 'GOOGLEDRIVE_ADD_FILE_SHARING_PREFERENCE',
        feature: 'Add File Sharing Preference',
        description:
          'Modifies sharing permissions for an existing Google Drive file, granting a specified role to a user, group, domain, or anyone.'
      },
      {
        key: 'GOOGLEDRIVE_ADD_SHARED_DRIVE_MEMBER',
        feature: 'Add Shared Drive Member',
        description:
          'Add a member (user/group/domain) to a Shared Drive with a specified role. Use when you need to grant access to a Shared Drive.'
      },
      {
        key: 'GOOGLEDRIVE_CREATE_COMMENT',
        feature: 'Create Comment',
        description:
          'Create a comment on a file. Use when you need to add a new comment to a specific file in Google Drive.'
      },
      {
        key: 'GOOGLEDRIVE_CREATE_DRIVE',
        feature: 'Create Drive',
        description:
          'Create a new shared drive. Use when you need to programmatically create a new shared drive for collaboration or storage.'
      },
      {
        key: 'GOOGLEDRIVE_CREATE_FILE',
        feature: 'Create File',
        description:
          'Creates a new file or folder with metadata. Use to create empty files or folders, or files with content by providing it in the request body.'
      },
      {
        key: 'GOOGLEDRIVE_CREATE_FOLDER',
        feature: 'Create Folder',
        description:
          'Creates a new folder in Google Drive, optionally within an EXISTING parent folder specified by its ID or name.'
      },
      {
        key: 'GOOGLEDRIVE_CREATE_REPLY',
        feature: 'Create Reply',
        description:
          'Create a reply to a comment in Google Drive. Use when you need to respond to an existing comment on a file.'
      },
      {
        key: 'GOOGLEDRIVE_CREATE_SHORTCUT_TO_FILE',
        feature: 'Create Shortcut',
        description:
          'Create a shortcut to a file or folder in Google Drive. Use when you need to link to an existing Drive item from another location without duplicating it.'
      },
      {
        key: 'GOOGLEDRIVE_DELETE_COMMENT',
        feature: 'Delete Comment',
        description:
          'Deletes a comment from a file. Use when you need to remove a specific comment from a Google Drive file.'
      },
      {
        key: 'GOOGLEDRIVE_DELETE_DRIVE',
        feature: 'Delete Drive',
        description:
          'Permanently delete a shared drive. Use when you need to remove a shared drive and its contents (if specified).'
      },
      {
        key: 'GOOGLEDRIVE_DELETE_PERMISSION',
        feature: 'Delete Permission',
        description:
          'Deletes a permission from a file by permission ID. Important: You must first call GOOGLEDRIVE_LIST_PERMISSIONS to get valid permission IDs.'
      },
      {
        key: 'GOOGLEDRIVE_DELETE_REPLY',
        feature: 'Delete Reply',
        description:
          'Delete a specific reply by reply ID. Use when you need to remove a reply from a comment on a file.'
      },
      {
        key: 'GOOGLEDRIVE_DOWNLOAD_FILE',
        feature: 'Download File',
        description:
          'Downloads a file from Google Drive by its ID. For Google Workspace documents, optionally exports to a specified mime_type.'
      },
      {
        key: 'GOOGLEDRIVE_DOWNLOAD_FILE_OPERATION',
        feature: 'Download File Operation',
        description:
          'Download file content using long-running operations. Use when you need to download Google Vids files or export Google Workspace documents.'
      },
      {
        key: 'GOOGLEDRIVE_EMPTY_TRASH',
        feature: 'Empty Trash',
        description:
          "Permanently delete all of the user's trashed files. Use when you want to empty the trash in Google Drive."
      },
      {
        key: 'GOOGLEDRIVE_FILES_MODIFY_LABELS',
        feature: 'Modify File Labels',
        description:
          'Modifies the set of labels applied to a file. Use when you need to programmatically change labels on a Google Drive file.'
      },
      {
        key: 'GOOGLEDRIVE_FIND_FILE',
        feature: 'Find File',
        description:
          'The comprehensive Google Drive search tool that handles all file and folder discovery needs. Use for any file finding task from simple name searches to complex queries.'
      },
      {
        key: 'GOOGLEDRIVE_GENERATE_IDS',
        feature: 'Generate IDs',
        description:
          'Generates a set of file IDs which can be provided in create or copy requests. Use when you need to pre-allocate IDs for new files or copies.'
      },
      {
        key: 'GOOGLEDRIVE_GET_ABOUT',
        feature: 'Get About Information',
        description:
          "Retrieve information about the user, the user's Drive, and system capabilities. Use when you need to check storage quotas or user details."
      },
      {
        key: 'GOOGLEDRIVE_GET_CHANGES_START_PAGE_TOKEN',
        feature: 'Get Changes Start Token',
        description:
          'Get the starting pageToken for listing future changes in Google Drive. Use when you need to track changes to files and folders.'
      }
    ]
  },
  notion: {
    name: 'Notion',
    description:
      'Search through pages and databases from your Notion workspace',
    icon: 'notion',
    documentLimit: 2000,
    syncTag: 'notion',
    features: [
      {
        key: 'NOTION_ADD_MULTIPLE_PAGE_CONTENT',
        feature: 'Add Multiple Page Content',
        description:
          'Bulk-add content blocks to Notion. Text >2000 chars auto-splits. Parses markdown formatting. Adds content as children of parent block.'
      },
      {
        key: 'NOTION_CREATE_COMMENT',
        feature: 'Create Comment',
        description:
          'Adds a comment to a Notion page or to an existing discussion thread; cannot create new discussion threads on specific blocks.'
      },
      {
        key: 'NOTION_CREATE_DATABASE',
        feature: 'Create Database',
        description:
          'Creates a new Notion database as a subpage under a specified parent page with a defined properties schema.'
      },
      {
        key: 'NOTION_CREATE_NOTION_PAGE',
        feature: 'Create Page',
        description:
          'Creates a new empty page in a Notion workspace under a specified parent page or database.'
      },
      {
        key: 'NOTION_DELETE_BLOCK',
        feature: 'Delete Block',
        description:
          'Archives a Notion block, page, or database using its ID, which sets its archived property to true (like moving to Trash).'
      },
      {
        key: 'NOTION_FETCH_ALL_BLOCK_CONTENTS',
        feature: 'Fetch All Block Contents',
        description:
          'Fetch all child blocks for a given Notion block. Supports optional recursive expansion of nested blocks.'
      },
      {
        key: 'NOTION_FETCH_BLOCK_CONTENTS',
        feature: 'Fetch Block Contents',
        description:
          'Retrieves a paginated list of direct, first-level child block objects along with contents for a given parent Notion block or page.'
      },
      {
        key: 'NOTION_FETCH_COMMENTS',
        feature: 'Fetch Comments',
        description:
          'Fetches unresolved comments for a specified Notion block or page ID.'
      },
      {
        key: 'NOTION_FETCH_DATABASE',
        feature: 'Fetch Database',
        description:
          "Fetches a Notion database's structural metadata (properties, title, etc.) via its database_id."
      },
      {
        key: 'NOTION_FETCH_ROW',
        feature: 'Fetch Row',
        description:
          "Retrieves a Notion database row's properties and metadata; use fetch_block_contents for page content blocks."
      },
      {
        key: 'NOTION_GET_ABOUT_ME',
        feature: 'Get About Me',
        description:
          'Retrieves the User object for the bot associated with the current Notion integration token.'
      },
      {
        key: 'NOTION_GET_ABOUT_USER',
        feature: 'Get About User',
        description:
          'Retrieves detailed information about a specific Notion user, such as their name, avatar, and email.'
      },
      {
        key: 'NOTION_INSERT_ROW_DATABASE',
        feature: 'Insert Row to Database',
        description:
          'Creates a new page (row) in a specified Notion database. Requires exact property name and type matching.'
      },
      {
        key: 'NOTION_LIST_USERS',
        feature: 'List Users',
        description:
          'Retrieves a paginated list of users (excluding guests) from the Notion workspace.'
      },
      {
        key: 'NOTION_MOVE_PAGE',
        feature: 'Move Page',
        description:
          'Move a Notion page to a new parent (page or database). Use when you need to reorganize page hierarchy.'
      },
      {
        key: 'NOTION_QUERY_DATABASE',
        feature: 'Query Database',
        description:
          'Queries a Notion database to retrieve pages (rows). Returns paginated results with metadata.'
      },
      {
        key: 'NOTION_QUERY_DATABASE_WITH_FILTER',
        feature: 'Query Database with Filter',
        description:
          'Query a Notion database with server-side filtering, sorting, and pagination.'
      },
      {
        key: 'NOTION_QUERY_DATA_SOURCE',
        feature: 'Query Data Source',
        description:
          'Query a Notion data source to retrieve pages or child data sources with filters, sorts, and pagination.'
      },
      {
        key: 'NOTION_REPLACE_PAGE_CONTENT',
        feature: 'Replace Page Content',
        description:
          "Safely replaces a page's child blocks by optionally backing up current content, deleting existing children, then appending new children."
      },
      {
        key: 'NOTION_RETRIEVE_COMMENT',
        feature: 'Retrieve Comment',
        description:
          'Retrieve a specific comment by its ID. Use when you have a comment ID and need to fetch its details.'
      }
    ]
  },
  'google-calendar': {
    name: 'Google Calendar',
    description: 'Manage your schedule and calendar events',
    icon: 'google-calendar',
    documentLimit: 1000,
    syncTag: 'googlecalendar',
    features: [
      {
        key: 'GOOGLECALENDAR_ACL_DELETE',
        feature: 'Delete Access Control Rule',
        description:
          'Deletes an access control rule from a Google Calendar. Use when you need to remove sharing permissions for a user, group, or domain.'
      },
      {
        key: 'GOOGLECALENDAR_ACL_GET',
        feature: 'Get Access Control Rule',
        description:
          'Retrieves a specific access control rule for a calendar. Use when you need to check permissions for a specific user, group, or domain.'
      },
      {
        key: 'GOOGLECALENDAR_ACL_INSERT',
        feature: 'Insert Access Control Rule',
        description:
          'Creates an access control rule for a calendar. Use when you need to grant sharing permissions to a user, group, or domain.'
      },
      {
        key: 'GOOGLECALENDAR_CALENDAR_LIST_DELETE',
        feature: 'Delete Calendar from List',
        description:
          "Remove a calendar from the user's calendar list. Use when you need to unsubscribe from or hide a calendar."
      },
      {
        key: 'GOOGLECALENDAR_CALENDAR_LIST_GET',
        feature: 'Get Calendar from List',
        description:
          "Retrieves metadata for a SINGLE specific calendar from the user's calendar list by its calendar ID."
      },
      {
        key: 'GOOGLECALENDAR_CALENDAR_LIST_INSERT',
        feature: 'Insert Calendar to List',
        description:
          "Inserts an existing calendar into the user's calendar list."
      },
      {
        key: 'GOOGLECALENDAR_CALENDAR_LIST_PATCH',
        feature: 'Patch Calendar in List',
        description:
          "Updates an existing calendar on the user's calendar list using patch semantics. Allows partial updates."
      },
      {
        key: 'GOOGLECALENDAR_CALENDARS_DELETE',
        feature: 'Delete Calendar',
        description:
          'Deletes a secondary calendar that you own or have delete permissions on. Cannot delete primary calendars.'
      },
      {
        key: 'GOOGLECALENDAR_CALENDARS_UPDATE',
        feature: 'Update Calendar',
        description: 'Updates metadata for a calendar.'
      },
      {
        key: 'GOOGLECALENDAR_CHANNELS_STOP',
        feature: 'Stop Notification Channel',
        description:
          'Stop watching resources through a notification channel. Use when you need to discontinue push notifications.'
      },
      {
        key: 'GOOGLECALENDAR_CREATE_EVENT',
        feature: 'Create Event',
        description:
          'Create a Google Calendar event using start_datetime plus duration fields. By default, attempts to create a Google Meet link.'
      },
      {
        key: 'GOOGLECALENDAR_DELETE_EVENT',
        feature: 'Delete Event',
        description:
          'Deletes a specified event by event_id from a Google Calendar; this action is idempotent.'
      },
      {
        key: 'GOOGLECALENDAR_DUPLICATE_CALENDAR',
        feature: 'Duplicate Calendar',
        description:
          'Creates a new, empty Google Calendar with the specified title (summary).'
      },
      {
        key: 'GOOGLECALENDAR_EVENTS_GET',
        feature: 'Get Event',
        description:
          'Retrieves a SINGLE event by its unique event_id. This action does NOT list or search events.'
      },
      {
        key: 'GOOGLECALENDAR_EVENTS_INSTANCES',
        feature: 'Get Event Instances',
        description: 'Returns instances of the specified recurring event.'
      },
      {
        key: 'GOOGLECALENDAR_EVENTS_LIST_ALL_CALENDARS',
        feature: 'List Events from All Calendars',
        description:
          "Return a unified event list across all calendars in the user's calendar list for a given time range."
      },
      {
        key: 'GOOGLECALENDAR_FIND_EVENT',
        feature: 'Find Event',
        description:
          'Finds events in a specified Google Calendar using text query, time ranges, and event types.'
      },
      {
        key: 'GOOGLECALENDAR_FREE_BUSY_QUERY',
        feature: 'Free/Busy Query',
        description: 'Returns free/busy information for a set of calendars.'
      },
      {
        key: 'GOOGLECALENDAR_GET_CALENDAR',
        feature: 'Get Calendar',
        description:
          'Retrieves a specific Google Calendar, identified by calendar_id, to which the authenticated user has access.'
      },
      {
        key: 'GOOGLECALENDAR_GET_CALENDAR_PROFILE',
        feature: 'Get Calendar Profile',
        description:
          "Retrieves the authenticated user's primary calendar profile. Includes timezone, settings, and preferences."
      }
    ]
  },
  'google-sheets': {
    name: 'Google Sheets',
    description: 'Search and manage your spreadsheets',
    icon: 'google-sheets',
    documentLimit: 2000,
    syncTag: 'googlesheets',
    features: [
      {
        key: 'GOOGLESHEETS_ADD_SHEET',
        feature: 'Add Sheet',
        description:
          'Adds a new sheet to a spreadsheet. Supports three sheet types: GRID (standard spreadsheet), OBJECT (chart sheet), and DATA_SOURCE (BigQuery connected sheet).'
      },
      {
        key: 'GOOGLESHEETS_APPEND_DIMENSION',
        feature: 'Append Dimension',
        description:
          'Append new rows or columns to a sheet, increasing its size. Use when you need to add empty rows or columns to an existing sheet.'
      },
      {
        key: 'GOOGLESHEETS_BATCH_GET',
        feature: 'Batch Get',
        description:
          'Retrieves data from specified cell ranges in a Google Spreadsheet.'
      },
      {
        key: 'GOOGLESHEETS_BATCH_UPDATE',
        feature: 'Batch Update',
        description:
          'Write values to ONE range in a Google Sheet, or append as new rows if no start cell is given. Auto-expands grid for large datasets.'
      },
      {
        key: 'GOOGLESHEETS_CLEAR_BASIC_FILTER',
        feature: 'Clear Basic Filter',
        description:
          'Clear the basic filter from a sheet. Use when you need to remove an existing basic filter from a specific sheet.'
      },
      {
        key: 'GOOGLESHEETS_CREATE_GOOGLE_SHEET1',
        feature: 'Create Google Sheet',
        description:
          'Creates a new Google Spreadsheet in Google Drive. If no title is provided, Google will create a spreadsheet with a default name.'
      },
      {
        key: 'GOOGLESHEETS_DELETE_DIMENSION',
        feature: 'Delete Dimension',
        description:
          'Delete specified rows or columns from a sheet in a Google Spreadsheet. Use when you need to remove a range of rows or columns.'
      },
      {
        key: 'GOOGLESHEETS_DELETE_SHEET',
        feature: 'Delete Sheet',
        description:
          'Delete a sheet (worksheet) from a spreadsheet. Use when you need to remove a specific sheet from a Google Sheet document.'
      },
      {
        key: 'GOOGLESHEETS_FIND_REPLACE',
        feature: 'Find and Replace',
        description:
          'Find and replace text in a Google Spreadsheet. Use to fix formula errors, update values, or perform bulk text replacements across cells.'
      },
      {
        key: 'GOOGLESHEETS_GET_SHEET_NAMES',
        feature: 'Get Sheet Names',
        description:
          'Lists all worksheet names from a specified Google Spreadsheet, useful for discovering sheets before further operations.'
      },
      {
        key: 'GOOGLESHEETS_GET_SPREADSHEET_BY_DATA_FILTER',
        feature: 'Get Spreadsheet by Data Filter',
        description:
          'Returns the spreadsheet filtered by specified data filters. Use when you need to retrieve specific subsets of data based on criteria.'
      },
      {
        key: 'GOOGLESHEETS_GET_SPREADSHEET_INFO',
        feature: 'Get Spreadsheet Info',
        description:
          'Retrieves comprehensive metadata for a Google Spreadsheet using its ID, excluding cell data.'
      },
      {
        key: 'GOOGLESHEETS_INSERT_DIMENSION',
        feature: 'Insert Dimension',
        description:
          'Insert new rows or columns into a sheet at a specified location. Use when you need to add empty rows or columns within an existing sheet.'
      },
      {
        key: 'GOOGLESHEETS_MUTATE_CONDITIONAL_FORMAT_RULES',
        feature: 'Mutate Conditional Format Rules',
        description:
          'Add, update, delete, or reorder conditional format rules on a Google Sheet. Supports four operations: ADD, UPDATE, DELETE, MOVE.'
      },
      {
        key: 'GOOGLESHEETS_SEARCH_DEVELOPER_METADATA',
        feature: 'Search Developer Metadata',
        description:
          'Search for developer metadata in a spreadsheet. Use when you need to find specific metadata entries based on filters.'
      },
      {
        key: 'GOOGLESHEETS_SEARCH_SPREADSHEETS',
        feature: 'Search Spreadsheets',
        description:
          'Search for Google Spreadsheets using various filters including name, content, date ranges, and more.'
      },
      {
        key: 'GOOGLESHEETS_SET_BASIC_FILTER',
        feature: 'Set Basic Filter',
        description:
          'Set a basic filter on a sheet in a Google Spreadsheet. Use when you need to filter or sort data within a specific range on a sheet.'
      },
      {
        key: 'GOOGLESHEETS_SET_DATA_VALIDATION_RULE',
        feature: 'Set Data Validation Rule',
        description:
          'Set or clear data validation rules (including dropdowns) on a range in Google Sheets.'
      },
      {
        key: 'GOOGLESHEETS_SPREADSHEETS_SHEETS_COPY_TO',
        feature: 'Copy Sheet to Another Spreadsheet',
        description:
          'Copy a single sheet from a spreadsheet to another spreadsheet. Use when you need to duplicate a sheet into a different spreadsheet.'
      },
      {
        key: 'GOOGLESHEETS_SPREADSHEETS_VALUES_APPEND',
        feature: 'Append Values',
        description:
          'Append values to a spreadsheet. Use when you need to add new data to the end of an existing table in a Google Sheet.'
      }
    ]
  },
  'google-docs': {
    name: 'Google Docs',
    description: 'Search and manage your documents',
    icon: 'google-docs',
    documentLimit: 2000,
    syncTag: 'googledocs',
    features: [
      {
        key: 'GOOGLEDOCS_COPY_DOCUMENT',
        feature: 'Copy Document',
        description:
          'Create a copy of an existing Google Document. Use this to duplicate a document, for example, when using an existing document as a template.'
      },
      {
        key: 'GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN',
        feature: 'Create Document from Markdown',
        description:
          'Creates a new Google Docs document, optionally initializing it with a title and content provided as Markdown text.'
      },
      {
        key: 'GOOGLEDOCS_CREATE_FOOTER',
        feature: 'Create Footer',
        description:
          'Create a new footer in a Google Document. Use when you need to add a footer, optionally specifying its type and the section it applies to.'
      },
      {
        key: 'GOOGLEDOCS_CREATE_FOOTNOTE',
        feature: 'Create Footnote',
        description:
          'Create a new footnote in a Google Document. Use this when you need to add a footnote at a specific location or at the end of the document body.'
      },
      {
        key: 'GOOGLEDOCS_CREATE_HEADER',
        feature: 'Create Header',
        description:
          'Create a new header in a Google Document, optionally with text content. Use this tool when you need to add a header to a document.'
      },
      {
        key: 'GOOGLEDOCS_CREATE_NAMED_RANGE',
        feature: 'Create Named Range',
        description:
          'Create a new named range in a Google Document. Use this to assign a name to a specific part of the document for easier reference or programmatic manipulation.'
      },
      {
        key: 'GOOGLEDOCS_CREATE_PARAGRAPH_BULLETS',
        feature: 'Create Paragraph Bullets',
        description:
          'Add bullets to paragraphs within a specified range in a Google Document. Use when you need to format a list or a set of paragraphs as bullet points.'
      },
      {
        key: 'GOOGLEDOCS_DELETE_CONTENT_RANGE',
        feature: 'Delete Content Range',
        description:
          'Delete a range of content from a Google Document. Use when you need to remove a specific portion of text or other structural elements within a document.'
      },
      {
        key: 'GOOGLEDOCS_DELETE_FOOTER',
        feature: 'Delete Footer',
        description:
          'Delete a footer from a Google Document. Use when you need to remove a footer from a specific section or the default footer.'
      },
      {
        key: 'GOOGLEDOCS_DELETE_HEADER',
        feature: 'Delete Header',
        description:
          'Deletes the header from the specified section or the default header if no section is specified. Use this tool to remove a header from a Google Document.'
      },
      {
        key: 'GOOGLEDOCS_DELETE_NAMED_RANGE',
        feature: 'Delete Named Range',
        description:
          'Delete a named range from a Google Document. Use when you need to remove a previously defined named range by its ID or name.'
      },
      {
        key: 'GOOGLEDOCS_DELETE_PARAGRAPH_BULLETS',
        feature: 'Delete Paragraph Bullets',
        description:
          'Remove bullets from paragraphs within a specified range in a Google Document. Use when you need to clear bullet formatting from a section of a document.'
      },
      {
        key: 'GOOGLEDOCS_DELETE_TABLE',
        feature: 'Delete Table',
        description:
          'Delete an entire table from a Google Document. Use when you have the document ID and the specific start and end index of the table element to be removed.'
      },
      {
        key: 'GOOGLEDOCS_DELETE_TABLE_COLUMN',
        feature: 'Delete Table Column',
        description:
          'Delete a column from a table in a Google Document. Use this tool when you need to remove a specific column from an existing table within a document.'
      },
      {
        key: 'GOOGLEDOCS_DELETE_TABLE_ROW',
        feature: 'Delete Table Row',
        description:
          'Delete a row from a table in a Google Document. Use when you need to remove a specific row from an existing table.'
      },
      {
        key: 'GOOGLEDOCS_EXPORT_DOCUMENT_AS_PDF',
        feature: 'Export Document as PDF',
        description:
          'Export a Google Docs file as PDF using the Google Drive API. Use when you need to generate a PDF version of a Google Docs document for download or distribution.'
      },
      {
        key: 'GOOGLEDOCS_GET_CHARTS_FROM_SPREADSHEET',
        feature: 'Get Charts from Spreadsheet',
        description:
          'Retrieve a list of all charts from a specified Google Sheets spreadsheet. Use when you need to get chart IDs and their specifications for embedding or referencing elsewhere.'
      },
      {
        key: 'GOOGLEDOCS_GET_DOCUMENT_PLAINTEXT',
        feature: 'Get Document Plaintext',
        description:
          'Retrieve a Google Doc by ID and return a best-effort plain-text rendering. Converts document structure into plain text including paragraphs, lists, and tables.'
      },
      {
        key: 'GOOGLEDOCS_INSERT_INLINE_IMAGE',
        feature: 'Insert Inline Image',
        description:
          'Insert an image from a given URI at a specified location in a Google Document as an inline image. Use when you need to add an image to a document programmatically.'
      },
      {
        key: 'GOOGLEDOCS_INSERT_PAGE_BREAK',
        feature: 'Insert Page Break',
        description:
          'Insert a page break into a Google Document. Use when you need to start new content on a fresh page, such as at the end of a chapter or section.'
      }
    ]
  },
  linear: {
    name: 'Linear',
    description: 'Plan and track projects, issues, and team workflows',
    icon: 'linear',
    documentLimit: 1000,
    syncTag: 'linear',
    features: [
      {
        key: 'LINEAR_CREATE_LINEAR_PROJECT',
        feature: 'Create Project',
        description:
          'Creates a new Linear project with specified name and team associations.'
      },
      {
        key: 'LINEAR_GET_CURRENT_USER',
        feature: 'Get Current User',
        description:
          "Gets the currently authenticated user's ID, name, email, and other profile information. Use this to identify 'me' in other Linear operations."
      },
      {
        key: 'LINEAR_REMOVE_ISSUE_LABEL',
        feature: 'Remove Issue Label',
        description:
          "Removes a specified label from an existing Linear issue using their IDs; successful even if the label isn't on the issue."
      },
      {
        key: 'LINEAR_REMOVE_REACTION',
        feature: 'Remove Reaction',
        description:
          'Tool to remove a reaction on a comment. Use when you have a reaction ID and need to delete it.'
      },
      {
        key: 'LINEAR_RUN_QUERY_OR_MUTATION',
        feature: 'Run GraphQL Query/Mutation',
        description:
          "Execute any GraphQL query or mutation against Linear's API. Use when no dedicated action exists, need complex filtering, custom fields, or schema discovery."
      },
      {
        key: 'LINEAR_SEARCH_ISSUES',
        feature: 'Search Issues',
        description:
          'Search Linear issues using full-text search across identifier, title, and description. Use when you need to find issues by keywords or specific identifiers.'
      },
      {
        key: 'LINEAR_UPDATE_ISSUE',
        feature: 'Update Issue',
        description:
          'Updates an existing Linear issue using its issue_id; requires at least one other attribute for modification, and all provided entity IDs must be valid.'
      },
      {
        key: 'LINEAR_UPDATE_LINEAR_PROJECT',
        feature: 'Update Project',
        description:
          'Tool to update an existing Linear project. Use when you need to modify project properties like name, description, state, dates, or lead.'
      }
    ]
  },

  supabase: {
    name: 'Supabase',
    description:
      'Manage your backend: database, auth, storage, and edge functions',
    icon: 'supabase',
    documentLimit: 1000,
    syncTag: 'supabase',
    features: [
      {
        key: 'SUPABASE_BETA_RUN_SQL_QUERY',
        feature: 'Execute SQL Query',
        description:
          "Executes a given SQL query against the project's database."
      },
      {
        key: 'SUPABASE_CREATE_A_FUNCTION',
        feature: 'Create Function',
        description:
          'Creates a new serverless Edge Function for a Supabase project.'
      },
      {
        key: 'SUPABASE_CREATE_AN_ORGANIZATION',
        feature: 'Create Organization',
        description: 'Creates a new Supabase organization.'
      },
      {
        key: 'SUPABASE_CREATE_A_PROJECT',
        feature: 'Create Project',
        description: 'Creates a new Supabase project.'
      },
      {
        key: 'SUPABASE_DEPLOY_FUNCTION',
        feature: 'Deploy Function',
        description: 'Deploys Edge Functions to a Supabase project.'
      },
      {
        key: 'SUPABASE_GENERATE_TYPE_SCRIPT_TYPES',
        feature: 'Generate TypeScript Types',
        description:
          "Generates and retrieves TypeScript types from a Supabase project's database."
      },
      {
        key: 'SUPABASE_GETS_PROJECT_S_SERVICE_HEALTH_STATUS',
        feature: 'Get Project Health',
        description:
          'Retrieves the current health status for a Supabase project.'
      },
      {
        key: 'SUPABASE_GET_TABLE_SCHEMAS',
        feature: 'Get Table Schemas',
        description:
          'Retrieves column details, types, and constraints for multiple database tables.'
      },
      {
        key: 'SUPABASE_INVOKE_EDGE_FUNCTION',
        feature: 'Invoke Edge Function',
        description: 'Invokes a deployed Supabase Edge Function over HTTPS.'
      },
      {
        key: 'SUPABASE_LIST_ALL_FUNCTIONS',
        feature: 'List Functions',
        description:
          'Lists metadata for all Edge Functions in a Supabase project.'
      },
      {
        key: 'SUPABASE_LIST_ALL_ORGANIZATIONS',
        feature: 'List Organizations',
        description:
          'Lists all organizations associated with the Supabase account.'
      },
      {
        key: 'SUPABASE_LIST_ALL_PROJECTS',
        feature: 'List Projects',
        description: 'Retrieves a list of all Supabase projects.'
      },
      {
        key: 'SUPABASE_LISTS_ALL_BUCKETS',
        feature: 'List Buckets',
        description:
          'Retrieves a list of all storage buckets for a Supabase project.'
      },
      {
        key: 'SUPABASE_LIST_TABLES',
        feature: 'List Tables',
        description: 'Lists all tables and views in specified database schemas.'
      },
      {
        key: 'SUPABASE_RETRIEVE_A_FUNCTION',
        feature: 'Retrieve Function',
        description:
          'Retrieves detailed information for a specific Edge Function.'
      },
      {
        key: 'SUPABASE_RETRIEVE_A_FUNCTION_BODY',
        feature: 'Retrieve Function Body',
        description:
          'Retrieves the source code for a specified serverless Edge Function.'
      },
      {
        key: 'SUPABASE_UPDATE_A_FUNCTION',
        feature: 'Update Function',
        description: "Updates an existing Supabase Edge Function's properties."
      },
      {
        key: 'SUPABASE_UPDATE_PROJECT_AUTH_CONFIG',
        feature: 'Update Auth Config',
        description:
          'Update Supabase project Auth configuration via the Management API.'
      }
    ]
  },
  shopify: {
    name: 'Shopify',
    description:
      'Manage your e-commerce store: products, orders, customers, and more',
    icon: 'shopify',
    documentLimit: 1000,
    syncTag: 'shopify',
    features: [
      {
        key: 'SHOPIFY_BULK_CREATE_PRODUCTS',
        feature: 'Bulk Create Products',
        description:
          'Creates many products (20-50+) in one asynchronous Shopify bulk mutation job.'
      },
      {
        key: 'SHOPIFY_BULK_QUERY_OPERATION',
        feature: 'Bulk Query Operation',
        description:
          'Run a Shopify GraphQL bulk query operation and return the result file URL.'
      },
      {
        key: 'SHOPIFY_COUNT_PRODUCT_IMAGES',
        feature: 'Count Product Images',
        description:
          'Retrieves the total count of images for a specific Shopify product.'
      },
      {
        key: 'SHOPIFY_CREATE_CUSTOM_COLLECTION',
        feature: 'Create Custom Collection',
        description: 'Create a new custom collection in Shopify.'
      },
      {
        key: 'SHOPIFY_CREATE_CUSTOMER',
        feature: 'Create Customer',
        description: 'Create a new customer in Shopify.'
      },
      {
        key: 'SHOPIFY_CREATE_ORDER',
        feature: 'Create Order',
        description: 'Create a new order in Shopify without payment processing.'
      },
      {
        key: 'SHOPIFY_CREATE_PRODUCT',
        feature: 'Create Product',
        description: 'Creates a new product in a Shopify store.'
      },
      {
        key: 'SHOPIFY_CREATE_PRODUCT_IMAGE',
        feature: 'Create Product Image',
        description: 'Create a new product image for a given product.'
      },
      {
        key: 'SHOPIFY_CREATE_RESOURCE_FEEDBACK',
        feature: 'Create Resource Feedback',
        description:
          'Creates shop-level resource feedback to notify Shopify merchants about app setup.'
      },
      {
        key: 'SHOPIFY_CREATES_A_NEW_PRODUCT',
        feature: 'Create New Product',
        description:
          'Tool to create a new product in Shopify with details like title, description, variants.'
      },
      {
        key: 'SHOPIFY_DISABLE_GIFT_CARD',
        feature: 'Disable Gift Card',
        description:
          'Permanently disables a gift card, preventing it from being used for purchases.'
      },
      {
        key: 'SHOPIFY_GET_ALL_CUSTOMERS',
        feature: 'Get All Customers',
        description: 'Retrieves customer records from a Shopify store.'
      },
      {
        key: 'SHOPIFY_GET_CUSTOMER',
        feature: 'Get Customer',
        description: 'Retrieves detailed information for a specific customer.'
      },
      {
        key: 'SHOPIFY_GET_CUSTOMERS_SEARCH',
        feature: 'Search Customers',
        description: 'Tool to search for customers matching a supplied query.'
      },
      {
        key: 'SHOPIFY_GET_ORDER',
        feature: 'Get Order',
        description: 'Retrieve a specific order using its unique identifier.'
      },
      {
        key: 'SHOPIFY_GET_SHOP_DETAILS',
        feature: 'Get Shop Details',
        description:
          'Retrieves comprehensive administrative information about the authenticated Shopify store.'
      },
      {
        key: 'SHOPIFY_LIST_ORDER',
        feature: 'List Orders',
        description:
          'Retrieves a list of orders from Shopify with optional filtering.'
      },
      {
        key: 'SHOPIFY_RETRIEVES_A_LIST_OF_CUSTOMERS',
        feature: 'List Customers',
        description:
          'Tool to retrieve a list of customers from a Shopify store.'
      },
      {
        key: 'SHOPIFY_RETRIEVES_A_LIST_OF_ORDERS',
        feature: 'List Orders',
        description: 'Retrieves a list of orders from Shopify.'
      },
      {
        key: 'SHOPIFY_RETRIEVES_A_LIST_OF_PRODUCTS',
        feature: 'List Products',
        description: 'Tool to retrieve a list of products from Shopify.'
      }
    ]
  },
  youtube: {
    name: 'YouTube',
    description: 'Online video sharing and social media platform',
    icon: 'youtube',
    documentLimit: 1000,
    syncTag: 'youtube',
    features: [
      {
        key: 'YOUTUBE_ADD_VIDEO_TO_PLAYLIST',
        feature: 'Add Video to Playlist',
        description:
          'Tool to add a video to a playlist by inserting a playlist item.'
      },
      {
        key: 'YOUTUBE_CREATE_PLAYLIST',
        feature: 'Create Playlist',
        description:
          "Tool to create a new YouTube playlist on the authenticated user's channel."
      },
      {
        key: 'YOUTUBE_LIST_CAPTION_TRACK',
        feature: 'List Caption Tracks',
        description: 'Retrieves a list of caption tracks for a YouTube video.'
      },
      {
        key: 'YOUTUBE_LIST_COMMENT_THREADS',
        feature: 'List Comment Threads',
        description: 'List comment threads from YouTube videos or channels.'
      },
      {
        key: 'YOUTUBE_POST_COMMENT',
        feature: 'Post Comment',
        description: 'Tool to post a new top-level comment on a YouTube video.'
      },
      {
        key: 'YOUTUBE_UPDATE_THUMBNAIL',
        feature: 'Update Thumbnail',
        description:
          'Sets the custom thumbnail for a YouTube video using an image from a URL.'
      }
    ]
  }
}

// Map our internal provider names to Composio toolkit slugs
export const PROVIDER_MAP: Record<ConnectorProvider, string> = {
  gmail: 'gmail',
  'google-drive': 'googledrive',
  notion: 'notion',
  'google-calendar': 'googlecalendar',
  'google-sheets': 'googlesheets',
  'google-docs': 'googledocs',
  linear: 'linear',
  supabase: 'supabase',
  shopify: 'shopify',
  youtube: 'youtube'
}

// Reverse map for convenience
export const TOOLKIT_MAP: Record<string, ConnectorProvider> = {
  gmail: 'gmail',
  googledrive: 'google-drive',
  notion: 'notion',
  googlecalendar: 'google-calendar',
  googlesheets: 'google-sheets',
  googledocs: 'google-docs',
  linear: 'linear',
  supabase: 'supabase',
  shopify: 'shopify',
  youtube: 'youtube'
}

export interface Connection {
  id: string
  provider: ConnectorProvider
  slug?: string
  name?: string
  icon?: string
  email: string
  createdAt: string
  isActive?: boolean
  documentCount?: number
}
