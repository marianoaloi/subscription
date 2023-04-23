import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.html'
]
  })

export class JsonDialogComponent implements OnInit {

    backupType: string; // 'bookmarks' | 'snippets';
    blobUrl: any;
    sanitizedBlobUrl: any;
    filename: string;
  
    constructor(
      private dialogRef: MatDialogRef<JsonDialogComponent>,
      private router: Router,
      @Inject(MAT_DIALOG_DATA) data:any,
      private sanitizer: DomSanitizer
    ) {
      this.sanitizedBlobUrl = this.sanitizer.bypassSecurityTrustUrl(data.blobUrl);
      this.blobUrl = data.blobUrl;
      this.backupType = data.backupType;
      const currentDate = new Date();
      this.filename = `${this.backupType}_${currentDate.toISOString()}.json`;
    }
  
    ngOnInit() {
    }
  
    close() {
      this.dialogRef.close();
    }
  
    download() {
    }
  
    viewInBrowser() {
      window.open(this.blobUrl);
    }
  }
  