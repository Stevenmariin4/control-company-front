import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  FieldPath,
  Firestore,
  QuerySnapshot,
  WhereFilterOp,
  collection,
  doc,
  documentId,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { IDynamicFilterByProperty } from '../../models/dynamic.table.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export abstract class DynamicFilterService {
  private db = inject(Firestore);
  public nameCollection: string = '';
  protected filterCollection;
  private httpClient = inject(HttpClient);
  private listAttributes: string[] | undefined;
  constructor(nameCollection: string, attributes?: string[]) {
    this.nameCollection = nameCollection;
    this.listAttributes = attributes;
    this.filterCollection = collection(this.db, this.nameCollection);
  }

  public create(data: any) {
    data.is_valid = true;
    data.created_at = this.returnNewDate();
    return new Promise<any>((resolve, reject) => {
      try {
        this.httpClient
          .post(`${environment.urlApi}?nameTable=${this.nameCollection}`, data)
          .subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
      } catch (error) {}
    });
  }

  public getById(id: string) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        this.httpClient
          .get(`${environment.urlApi}${id}?nameTable=${this.nameCollection}`)
          .subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
      } catch (error) {
        reject(error);
      }
    });
  }

  public update(id: string, data: any) {
    return new Promise<any>((resolve, reject) => {
      try {
        this.httpClient
          .patch(
            `${environment.urlApi}${id}?nameTable=${this.nameCollection}`,
            data
          )
          .subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
      } catch (error) {}
    });
  }

  public delete(id: string) {
    return new Promise<any>((resolve, reject) => {
      try {
        const data = {
          deleted_at: this.returnNewDate(),
          is_valid: false,
        };
        this.httpClient
          .patch(
            `${environment.urlApi}${id}/nameTable=${this.nameCollection}`,
            data
          )
          .subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
      } catch (error) {}
    });
  }
  public async filter(toSearch: any, byProperty?: IDynamicFilterByProperty[]) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const filter: any = {
          filter: byProperty ? byProperty : {},
          toSearch,
          attributes: this.listAttributes,
        };
        this.httpClient
          .post(
            `${environment.urlApi}filter?nameTable=${this.nameCollection}`,
            filter
          )
          .subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
      } catch (error) {
        reject(error);
      }
    });
  }
  private returnNewDate() {
    const date = new Date().toISOString();
    return date;
  }
}
