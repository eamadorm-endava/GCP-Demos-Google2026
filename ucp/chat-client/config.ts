/*
 * Copyright 2026 UCP Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export class AppProperties {
  name: string;
  description: string;
  logoUrl: string;
  defaultMessage: string;
  titleText: string;
  ucpInfoText?: string;

  constructor(
    name: string,
    description: string,
    logoUrl: string,
    defaultMessage: string,
    titleText: string,
    ucpInfoText?: string,
  ) {
    this.name = name;
    this.description = description;
    this.logoUrl = logoUrl;
    this.defaultMessage = defaultMessage;
    this.titleText = titleText;
    this.ucpInfoText = ucpInfoText;
  }
}

export const appConfig = new AppProperties(
    'Premium Coffee Shopper',
    'Your personal coffee shopping assistant.',
    // Made the image path relative (added a dot) so it works regardless of the base URL path
    './images/endava_symbol_RGB.png',
    'Hello, I am here to assist you with your coffee shopping. How can I help you?',
    'Endava UCP Coffee Explorer',
    'This demo compares two stores — one with poor UCP and one with proper UCP — to show how UCP improves transparency and checkout visibility.',
);
