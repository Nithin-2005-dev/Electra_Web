# API Reference

This file documents route handlers currently present in the repository.

## User Portal APIs (`electra-user-portal/src/app/api`)

### Admin

- `GET /api/admin/orders/list`
  - List payment queues and product batches by tab.
- `GET /api/admin/users/list`
  - List users for admin views.
- `POST /api/admin/approve`
  - Approve order payment.
- `POST /api/admin/reject`
  - Reject order payment.
- `POST /api/admin/ship-product`
  - Mark product batch items as shipped.
- `POST /api/admin/deliver-product`
  - Mark product batch items as delivered.

### Public/Shared

- `GET /api/getGalleryImages`
- `GET /api/getTeam`
- `POST /api/getRes`
- `POST /api/notify-payment`

### Resources

- `POST /api/resources/upload`
- `GET /api/resources/my`
- `PUT /api/resources/update`
- `DELETE /api/resources/delete`

## Admin Portal APIs (`electra-admin-portal/src/app/api`)

- `POST /api/image-upload`
- `GET /api/getImg`
- `DELETE /api/deleteImg`
- `POST /api/uploadTeam`
- `GET /api/getTeam`
- `DELETE /api/deleteTeam`
- `POST /api/res-upload`
- `POST /api/getRes`
- `DELETE /api/deleteRes`

## Contract and Change Management

When changing any route:

1. Keep method/path stable unless versioning intentionally.
2. Document request/response shape in route-level comments.
3. Update frontend callers and this file in the same PR.
4. Validate auth/role checks for admin-sensitive routes.
