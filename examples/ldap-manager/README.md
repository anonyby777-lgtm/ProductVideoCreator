# LDAP Manager Video Production Example

**[中文文档](README_zh.md)**

A real-world example of creating a product introduction video, demonstrating the complete workflow.

## Video Info

- **Product**: LDAP Manager - Multi-node Account Management Platform
- **Duration**: ~2 minutes 5 seconds (125 seconds)
- **Resolution**: 1920x1080 @ 30fps

## Video Structure

| Section | Time | Duration | Content |
|---------|------|----------|---------|
| Opening | 0:00-0:10 | 10s | Logo animation + product name + tagline |
| Features | 0:10-0:18 | 8s | 6 feature cards showcase |
| Demo | 0:18-1:55 | 97s | Full screen recording demo |
| Closing | 1:55-2:05 | 10s | Logo + slogan + call-to-action |

## Demo Content

The screen recording covers the following features:

1. **Statistics Dashboard** - 30-day authentication trend charts
2. **Node Switching** - Multi-node data viewing
3. **Tab Navigation** - Auth stats / Sync stats toggle
4. **Service Status** - Node service status monitoring
5. **Account Management** - Navigation and list display
6. **Account Search** - Search by username
7. **Auth Logs** - Query user authentication history
8. **Batch Operations** - Select and enable accounts
9. **Data Export** - Export to Excel

## Files

| File | Description |
|------|-------------|
| `FinalVideo.tsx` | Remotion video composition component |
| `record_final_v3.js` | Playwright screen recording script |
| `generate_final_voiceover.py` | Voiceover generation script (edge-tts) |
| `timeline_v3.json` | Recording timeline events |

## Key Lessons

### 1. Storyboard Confirmation

During production, the storyboard went through 3 iterations:
- v1: Missing opening, incomplete feature demo
- v2: Added service status color legend, batch operations
- v3: Final confirmed version

**Lesson**: Always confirm storyboard with user before recording!

### 2. Time Offset Calculation

```
Recording event time + 18s (opening + features) = Final video time
```

Examples:
- Recording 20.8s page loaded -> Final video 38.8s
- Recording 45.5s click account menu -> Final video 63.5s

### 3. Voiceover Sync

Voiceover timing must be precisely calculated. Each segment must match the corresponding video content.

## Using This Example

Use these files as templates for your own product video:

1. Modify `record_final_v3.js` - Update test data and operation steps
2. Modify `generate_final_voiceover.py` - Update voiceover text and timeline
3. Modify `FinalVideo.tsx` - Update scene components and branding
