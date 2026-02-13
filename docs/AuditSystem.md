# Audit Plugin & Helpers Documentation

To ensure consistency across our models, we use the `auditPlugin` and helper functions to manage `createdBy` and `updatedBy` fields.

## 1. Mongoose Plugin (`auditPlugin.js`)
This plugin adds the `createdBy` and `updatedBy` fields to any Mongoose schema.

### Implementation
File: `src/utils/auditPlugin.js`

```javascript
import mongoose from "mongoose";

export const auditPlugin = (schema) => {
    schema.add({
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false 
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        }
    });

    schema.index({ createdBy: 1 });
    schema.index({ updatedBy: 1 });
};
```

### How to use in Models
Instead of defining the fields manually, simply import the plugin and apply it.

```javascript
import mongoose from "mongoose";
import { auditPlugin } from "../../../utils/auditPlugin.js";

const MySchema = new mongoose.Schema({
    name: String
}, { timestamps: true });

// Apply the plugin
MySchema.plugin(auditPlugin);

export const MyModel = mongoose.model("MyModel", MySchema);
```

---

## 2. Global Helper for Data Updation
Since Mongoose doesn't have access to the `req` object, we can use a small helper function to attach user IDs to our data objects before saving/updating.

### Recommended Helper Function
Add this to a utility file (e.g., `src/utils/helpers.js`):

```javascript
/**
 * Attaches audit fields (createdBy/updatedBy) to a data object.
 * @param {Object} data - The data to be saved/updated.
 * @param {String} userId - The ID of the user performing the action.
 * @param {Boolean} isUpdate - Whether this is an update operation.
 */
export const withAudit = (data, userId, isUpdate = false) => {
    if (isUpdate) {
        return { ...data, updatedBy: userId };
    }
    return { ...data, createdBy: userId, updatedBy: userId };
};
```

### Usage in Controller/Service
```javascript
const createdBy = req.user._id;
const dataWithAudit = withAudit(req.body, createdBy);

await service.create(dataWithAudit);
```

### Usage for Updates
```javascript
const updatedBy = req.user._id;
const updateData = withAudit(req.body, updatedBy, true);

await service.update(id, updateData);
```
