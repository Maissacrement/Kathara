#!/usr/bin/node

// modules
const fs = require("fs")
const yaml = require("js-yaml")
const cmdLists = []
const lab = new Set([])

const createFile = (fileName, message) => {
  fs.writeFile(`../test/${fileName}`, `${message}\n`, { encode: 'utf-8', flag: 'a+' },(err) => {
    if(err) throw new Error('err')
    console.log(fileName, ' has been created')
  })
}

const labs = (machine, machineName) => lab.add(machine['net'].map((domaine,i) =>{
    createFile('lab.conf', `${machineName}[${i}]=${domaine}`);
    return `${machineName}[${i}]=${domaine}`;
}))

const pushCommand = (cmdLists, machineName, ip, mask) => (_,index) => {
  cmdLists.push({
    cmd: `ifconfig eth${index} ${ip}/${mask} up`,
  })
  Object.keys(cmdLists).forEach(
    key => {
      createFile(`${machineName}.startup`, cmdLists[key]['cmd'])
      createFile(`${machineName}.startup`, cmdLists[key]['cmd2'])
    }
  )
}

try {
  const fichierYaml = fs.readFileSync('./conf.yml', 'utf-8')
  const donnee = yaml.safeLoad(fichierYaml)
  if(!Object.prototype.hasOwnProperty.call(donnee, 'all')) throw new Error('Empty file')
  if(!Object.prototype.hasOwnProperty.call(donnee.all, 'hosts')) throw new Error('Undefined hosts')
  const main = machineName => {
    const machine = donnee['all']['hosts'][machineName];
    const ipVersion = Object.keys(machine)[0]
    const ip = machine[ipVersion]['addr']
    const mask = machine[ipVersion]['mask']
    
    Array.from(labs(machine[ipVersion], machineName))
    .forEach(
      pushCommand(cmdLists, machineName, ip, mask)
    )
  }

  Object.keys(donnee.all.hosts).forEach(main)

  //createFile()
  console.log(lab)
  console.log(cmdLists)
} catch (e) {
  console.log(e)
}

// Global
/*const args = process.argv.slice(2)

for(let i=0;i < args.length/2;i++) {
    key=args[i*2]
    value=args[i*2+1]
    console.log(key)
}*/


