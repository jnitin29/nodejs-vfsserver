#!/usr/bin/env babel-node

require('./helper')
let fs = require('fs').promise
let path = require("path")
let Hapi = require('hapi')
let asyncHandlerPlugin = require('hapi-async-handler')
let dirName = "files/"

async function main() {
    // Use 'await' in here
    console.log('Starting server...')

    // Your implementation here
    let server = new Hapi.Server()
    server.register(asyncHandlerPlugin)
    let port = 8000
    await server.connection({port})
    console.log(`Listening @ http://127.0.0.1:${port}`)
    await server.start()

    server.route({
    method: 'GET',
    path: '/{name}',
    handler: {
        async: readHandler
    }})
    server.route({
    method: 'PUT',
    path: '/create/{name}',
    handler: {
        async: createHandler
    }})
    server.route({
    method: 'POST',
    path: '/update/{name}',
    handler: {
       async: updateHandler
    }})
    server.route({
    method: 'DELETE',
    path: '/delete/{name}',
    handler: {
       async: deleteHandler
    }})

}

async function readHandler(request, reply) {
    console.log(encodeURIComponent(request.params.name))
    const filePath = path.join(dirName + encodeURIComponent(request.params.name))
    let stat = await fs.stat(filePath)
    let data = undefined;
    if (!stat.isDirectory()) {
      data = await fs.readFile (filePath)
    }
    reply(data);
}

async function createHandler(request, reply) {
  console.log(encodeURIComponent(request.params.name))
  const filePath = path.join(dirName + encodeURIComponent(request.params.name))
  await fs.open (filePath, "wx")
  reply("file created successfully\n");
}

async function updateHandler(request, reply) {
  let data = request.payload.data
  const filePath = path.join(dirName + encodeURIComponent(request.params.name))
  await fs.writeFile (filePath, data)
  reply("file updated successfully\n");
}

async function deleteHandler(request, reply) {
  console.log(encodeURIComponent(request.params.name))
  const filePath = path.join(dirName + encodeURIComponent(request.params.name))
  await fs.unlink (filePath)
  reply("file deleted successfully\n");
}

main()
