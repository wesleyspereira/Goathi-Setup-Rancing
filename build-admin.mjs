import {build} from 'vite'
import {rename} from 'node:fs/promises'
await build({configFile:'vite.admin.config.js'})
await rename('dist-admin/admin.html','dist-admin/index.html')
