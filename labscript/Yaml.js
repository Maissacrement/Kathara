/*
    This file is part of yaml.

    yaml is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    yaml is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with yaml.  If not, see <https://www.gnu.org/licenses/>.
*/
const fs = require("fs")
const yaml = require("js-yaml")

class YamlWrapper {
    constructor(yamlFileName) {
        this.yamlFile = fs.readFileSync(`${__dirname}/${yamlFileName}`, 'utf-8')
        this.data = yaml.safeLoad(this.yamlFile)
        if(!Object.prototype.hasOwnProperty.call(this.data, 'all'))
            throw new Error('Empty file')
        if(!Object.prototype.hasOwnProperty.call(this.data.all, 'hosts'))
            throw new Error('Undefined hosts')

        this.tempObj = {}
    }

    get sequenceOfDotInYaml() {
        let dotSeq = new RegExp('(([a-zA-Z0-9]+[\.])+[a-zA-Z0-9]+)\":null', 'g')


        return [ ...JSON.stringify(this.data['all']['hosts']).matchAll(dotSeq) ]
    }

    loopExist(data) {
        return Object.keys(data)
            .filter(x => x == 'loop').length > 0 ? true : false
    }

    arrayExplorationOfObj(arrOfKey,obj) {
      let temp = obj
      const way = arrOfKey

      // for each key obj is target sub object key
      function* genTest () {
          for(let i = 0;i < way.length;i++) {
              temp = temp[way[i]]
              yield temp
          }
      }

      const explorator = genTest()
      for(let i = 0;i<way.length;i++) {
          // forwarding on a new obj
          explorator.next()
      }

      return temp
    }

    // Tranform object with a "loop" key in
    // array template
    loopToJsObject(lObject) {
        const newObj = []

        // Tous les champ de lObjet sans loop
        const keysWithoutLoop = Object.keys(lObject)
            .filter(x => x !== "loop")

        // Retourne le chemin ou non de chaque attribut menant
        // à un champs de l'objet [ 'champ1', 'champ2' ]
        const howToGoInLoop = x => JSON.stringify(lObject[x]).indexOf('.') >= 0 ?
            Object.keys(lObject[x]).map( x => x.split('.')
              .filter(y => y !== 'item'))
              .map(arr => { return { field: x, way: arr } })[0] : false

        // howToGoInLoop filtrer
        let wayToGoToLoop = keysWithoutLoop
          .map(howToGoInLoop)
          .filter(x => x)

        // creer un nouvelle obj a partir de loop et de
        // ses clee adjacente
        const newObjFromLoop = (_, index) => {
          /* Pour chaque element de loop */
          newObj.push({})
          const way = wayToGoToLoop
          keysWithoutLoop.map((x) => {
            /* Pour chaque cle de lObject root sans "loop" */
            /* [ addr, net, mask ] */
            way.filter(data => data['field'] === x)
              .forEach(data => {
                newObj[index][x] = this.arrayExplorationOfObj(data['way'], lObject["loop"][index])
              })
          })
        }

        // Pour chaque element de "loop"
        Object.keys(lObject["loop"])
          .forEach(index => newObjFromLoop(lObject["loop"][index], index))

        return newObj
    }

    loopToObject() {
      const data = this.data['all']['hosts']
      const res = Object.keys(data)
        .filter(nomDeLamachine =>
          Object.prototype.hasOwnProperty.call(data[nomDeLamachine], 'ipv4'))
        .filter(nomDeLamachine =>
          Object.prototype.hasOwnProperty.call(data[nomDeLamachine]['ipv4'], 'loop'))
        .forEach((nomDeLamachine, ind) => {
          let staticElement = {};
          Object.keys(data[nomDeLamachine]['ipv4'])
            .filter(x => typeof data[nomDeLamachine]['ipv4'][x] === 'string' || typeof data[nomDeLamachine]['ipv4'][x] === 'number')
            .forEach((key,i) => {
              // Pour chaque element static
              staticElement[key] = data[nomDeLamachine]['ipv4'][key]

              this.tempObj = this.loopToJsObject(data[nomDeLamachine]['ipv4'])
                .map(obj => Object.assign(obj, staticElement))
            })

          if(ind === 0) { data[nomDeLamachine]['ipv4'] = [] }

          data[nomDeLamachine]['ipv4'] = this.tempObj
        })

      return this.data['all']['hosts']
    }
}

module.exports = YamlWrapper
