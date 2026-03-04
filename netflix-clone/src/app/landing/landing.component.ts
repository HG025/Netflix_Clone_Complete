import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  landingForm!: FormGroup;
  year = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.landingForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }
login() {
  this.router.navigate(['/login']);
}

getStarted() {
  this.router.navigate(['/signup'], {
    queryParams: {email: this.landingForm.value.email}
  })
}

reasons = [
  {
    title: 'Enjoy on your TV',
    text: 'Watch on smart TVs, Playstation, xbox, players and more.',
    icon: 'tv'
  },
  {
    title: 'Download your shows to watch offline',
    text: 'Save your favorites easily and always have something to watch.',
    icon: 'file_download'
  },
  {
    title: 'Watch everywhere',
    text: 'Stream unlimited movies and TV shows on your phone, tablet, laptop and TV.',
    icon: 'devices'
  },
  {
    title: 'Create profile for kids',
    text: 'Send kids on adventures in a space made just for them - free with uour membership.',
    icon: 'face'
  },
]

faqs = [
  {
    question: 'What is PulseScreen',
    answer: 'PulseScreen is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.'
  },
  {
    question: 'How much does PulseScreen cost?',
    answer: 'plan starts from 149 a month. No extra cost, no contracts.'
  },
  {
    question: 'How much does PulseScreen cost?',
    answer: 'plan starts from 149 a month. No extra cost, no contracts.'
  },
  {
    question: 'How much does PulseScreen cost?',
    answer: 'plan starts from 149 a month. No extra cost, no contracts.'
  },
  {
    question: 'How much does PulseScreen cost?',
    answer: 'plan starts from 149 a month. No extra cost, no contracts.'
  },
  {
    question: 'How much does PulseScreen cost?',
    answer: 'plan starts from 149 a month. No extra cost, no contracts.'
  },
  {
    question: 'How much does PulseScreen cost?',
    answer: 'plan starts from 149 a month. No extra cost, no contracts.'
  },
]

}
