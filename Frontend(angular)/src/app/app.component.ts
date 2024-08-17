import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  email = '';
  password = '';
  tokens = { token: "", email: "", password: "" };
  error: string = '';

  ngOnInit() {
    this.getEmailAndPassword();
  }

  async handleGettingNewToken() {
    try {
      const response = await axios.post('http://135.181.125.114/gettingNewToken', {
        email: this.email,
        password: this.password,
      });

      const data = response.data;

      if (response.status === 200) {
        this.tokens = data;

        // Save tokens to local file
        const fileData = data;
        this.saveTokensToFile(fileData, 'tokens.txt');
      } else {
        this.error = data.error; // Set the error message
      }
    } catch (error) {
      this.error = 'Error occurred while getting a new token. Input Correct Email Address'; // Set a generic error message
      console.log('Error:', error);
    }
  }

  async getEmailAndPassword() {
    try {
      const response = await axios.get('http://135.181.125.114/token');
      const data = response.data;

      if (response.status === 200) {
        this.tokens = data;
      } else {
        this.error = data.error; // Set the error message
      }
    } catch (error) {
      this.error = 'Error occurred while retrieving email and password.'; // Set a generic error message
      console.log('Error:', error);
    }
  }

  saveTokensToFile(fileData: any, fileName: string) {
    console.log(fileData, fileName);
    const element = document.createElement('a');
    const file = new Blob([fileData?.token], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  }
}
