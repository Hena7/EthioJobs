# EthioJobs Hub - Implementation TODO

## Planned next increment (after backend overview)

1. Inventory existing backend modules:
   - ResumeController + ResumeService
   - ApplicationController + ApplicationService
   - BookmarkController + BookmarkService
   - NotificationController + NotificationService
   - AdminController + AdminService
   - Seed/Bootstrap logic (if present)
2. Fix/confirm any missing REST endpoints required by the spec:
   - POST /api/resumes/upload
   - GET /api/resumes/mine
   - DELETE /api/resumes/{id}
   - POST /api/jobs/{id}/apply
   - GET /api/applications/mine
   - GET /api/jobs/{id}/applications
   - PATCH /api/applications/{id}/status
   - POST /api/bookmarks/{jobId}
   - DELETE /api/bookmarks/{jobId}
   - GET /api/bookmarks/mine
   - GET /api/notifications/mine
   - PATCH /api/notifications/{id}/read
   - PATCH /api/notifications/read-all
   - Admin user/job moderation + analytics
3. Ensure consistent ApiResponse envelopes and validation.
4. Add/verify seed data population for demo.
5. Frontend wiring:
   - Verify hooks call correct endpoints/params
   - Update pages/components for employer/seeker/admin flows
   - Ensure auth/refresh flow works with Axios interceptors
