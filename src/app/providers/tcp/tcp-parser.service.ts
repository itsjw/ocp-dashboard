import { Injectable } from '@angular/core';

@Injectable()
export class TCPParserService {
  responses: any;

  utils = {
    /**
     * @name asciiToHexa
     * @namespace utils
     * @description converts ascii chars to hexa chars, return an Array of them
     *
     * @param {any} asciiChars
     * @returns an Array containing hexa codes
     */
    asciiToHexa: function(asciiChars) {
      const asciiCharsx = asciiChars.toString();
      const arr = [];
      for (let i = 0; i < asciiCharsx.length; i++) {
        // arr.push(asciiChars.charCodeAt(i).toString(16))
        arr.push(asciiCharsx.charCodeAt(i))
      }
      return arr;
    }

  }

  constructor() { }

  getParsedRes(data, resArr, responses) {
    this.responses = responses;

    // Getting transaction ID: look into responses array, split the 2 first chars of the last entry string.
    const currentTransactionId = this.getTransactionId();
    console.log('.' + currentTransactionId + '.')
    return this.constructTransactionObj(currentTransactionId, resArr, data);
  }

  // Getting transaction ID: look into responses array, split the 2 first chars of the last entry string.
  getTransactionId() {
    if (this.responses.length >= 2) {
      return this.responses[this.responses.length - 2].toString().substring(0, 2);
    } else {
      return null;
    }
  }

  constructTransactionObj(currentTransactionId, resArr, data) {

    switch (currentTransactionId) {

      // getClientList
      case '60': {
        return {
          uid: resArr[0] || null,
          cl_id: resArr[1] || null,
          nfc_id: resArr[2] || null,
          pin: resArr[3] || null,
        }
      }

      // createTag
      case '74': {
        return {
          uid: resArr[0] || null,
          cl_id: resArr[1] || null,
          nfc_id: resArr[2] || null,
          pin: resArr[3] || null,
        }
      }

      // confirmTag
      case '75': {
        console.log(data.toString())
        return this.translateResponseCode(data.toString());
      }

      // getTagsList
      case '76': {
        return {
          nfc_id: resArr[0] || null,
          pin: resArr[1] || null,
        }
      }

      // getTagInfo
      case '77': {
        return {
          nfc_id: resArr[0] || null,
          uid: resArr[1] || null,
          pin: resArr[2] || null,
          date_prog: resArr[3] || null,
          cl_nom: resArr[4] || null,
        }
      }

      default:
        // console.log('No transaction id found.');
        return null;
    }
  }


  // Côté Keygen
  //           0 OK
  //           1 Echec requete
  // 			     2 Echec lecture commande, fichier vide
  // 			     3 Mauvaise commande reçue
  // 			     4 Donnée reçue non correcte / Version soft incorrecte
  // 			     5 Requête base de données échouée ou Echec d'accès à la base de données.
  // 			     6 ID matériel interrogé inconnu de la base.
  // 			     7 Format de la date reçue incorrect.
  // 			     8 Numéro de lot de fabrication déjà existant et date de confirmation vide (ID et clé fournis).
  // 			     9 Numéro de lot de fabrication déjà existant et date de confirmation existante.
  translateResponseCode(responseCode) {
    switch (responseCode) {
      case '0':
        return 'OK'
      case '1':
        return 'Echec requete'
      case '2':
        return 'Echec lecture commande, fichier vide'
      case '3':
        return 'Mauvaise commande reçue'
      case '4':
        return 'Donnée reçue non correcte / Version soft incorrecte'
      case '5':
        return 'Requête base de données échouée ou Echec d\'accès à la base de données.'
      case '6':
        return 'ID matériel interrogé inconnu de la base.'
      case '7':
        return 'Format de la date reçue incorrecte.'
      case '8':
        return 'Numéro de lot de fabrication déjà existant et date de confirmation vide (ID et clé fournie).'
      case '9':
        return 'Numéro de lot de fabrication déjà existant et date de confirmation existante.'

      default:
        return 'Unknown responde code'
    }
  }


}
