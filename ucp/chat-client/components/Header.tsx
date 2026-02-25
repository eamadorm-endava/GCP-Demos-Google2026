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
import {appConfig} from '@/config';

function Header() {
  return (
    <header className="bg-white shadow-sm p-4 border-b border-solidBlue-20 flex-shrink-0">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-xl font-bold text-brand-dark flex justify-center items-center">
          <img
            src={appConfig.logoUrl}
            alt={appConfig.name}
            className="h-8 mr-3"
          />
          <span>{appConfig.titleText}</span>
        </h1>
        {appConfig.ucpInfoText && (
          <p className="mt-2 text-sm text-solidBlue-60">
            {appConfig.ucpInfoText}
          </p>
        )}
      </div>
    </header>
  );
}

export default Header;
