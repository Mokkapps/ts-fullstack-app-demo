# Building Full-Stack TypeScript Applications

# Introduction

1. Why a TS full-stack app?
    * Share code (like domain models) between frontend and backend
    * Use the same programming language & testing library in frontend and backend application 
    
    More details can be found in [this blog post](https://www.mokkapps.de/blog/nest-js-the-missing-piece-to-easily-develop-full-stack-typescript-web-applications/)

2. TypeScript
    * [Official website](https://www.typescriptlang.org/)
    * **!!! TYPES !!!**
    * Superset of JavaScript
3. NestJS

    Nest is a Node.js framework designed for building scalable
    server-side applications. In many ways, Nest is familiar to Angular
    developers:

    - It has excellent TypeScript support.
    - Its dependency injection system is similar to the one in Angular.
    - It emphasises testability.
    - Its configuration APIs are similar to Angular as well.
    - It uses annotations like used in SpringBoot etc.

    Many conventions and best practices used in Angular applications can be also be used in Nest.

4. Angular
    * [Official website](https://angular.io)
    * From prototype through global deployment, Angular delivers the productivity and scalable infrastructure that supports Google's largest applications. 
5. Nx

    It is a "monorepo" way of building applications.

    [Developing Like Google: Monorepos and Automation](https://nx.dev/fundamentals/develop-like-google)

    ### Prettier, Jest and Cypress per default

    Prettier is an opinionated code formatter. An Nx workspace comes with Prettier preconfigured.

    Jest is a fast 0-setup testing framework from Facebook.

    By default, Nx uses Jest for both Angular and Node.js applications. 

    Cypress is an e2e test runner built for modern web. It has a lot of great features:

    - Time travel
    - Real time reloads
    - Automatic waiting
    - Spies, stubs, and clocks
    - Network traffic control
    - Screenshots and videos

    NICE: By default, when creating a new Angular application, Nx will use Cypress to create the e2e tests project.

6. Demo

# Step by step 

## Add empty workspace

    npx create-nx-workspace@latest ts-fullstack-app-demo
    cd ts-fullstack-app-demo

## Add Angular frontend application

    ng add @nrwl/angular # Add Angular Capabilities to the workspace
    ng g @nrwl/angular:application frontend # Create an Angular Application

Now we can run:

- `ng serve frontend` to serve the application
- `ng build frontend` to build the application
- `ng test frontend` to test the application

- Add HttpClientModule to app.module.ts
- Implement API access in app.component.ts and app.component.html:

        export interface Dog {
        	imageUrl: string;
        }
        
        export class AppComponent {
          dog$: Observable<Dog[]>;
        
          constructor(http: HttpClient) {
            this.dog$ = http.get<Dog[]>('/api/dogs');
          }
        }

        <img *ngFor="let dog of (dog$ | async)" src="{{ dog.imageUrl }}" alt="Any dog image" />

## Add Nest.js backend application

    ng add @nrwl/nest # Add Node Capabilities to the workspace
    ng g @nrwl/nest:application api --frontend-project frontend # sets up the proxy configuration so you can access the API in development

Now we can run:

- `ng serve api` to serve the backend application
- `ng build api` to build the backend application
- `ng test api` to test the backend application

### Adding the dogs endpoint

- We use this amazing API: [https://dog.ceo/dog-api/documentation/random](https://dog.ceo/dog-api/documentation/random)
- Add HttpModule to app.module.ts (uses Axios behind the scenes)
- Add API call to app.service.ts

        constructor(private readonly httpService: HttpService) {}
        
        getDogs(){
            return this.httpService.get('[https://dog.ceo/api/breeds/image/random/10](https://dog.ceo/api/breeds/image/random/10)').pipe(map(res => res.data.message.map(m => {
        			return { imageUrl: m };
        		});
          }

- Add service call and endpoint to app.component.ts

        @Get('dogs')
        getDogs(): Observable<Dog[]> {
        	return this.appService.getDogs();
        }

    Run 

        ng serve frontend & ng serve api

## Share code between frontend and backend

Problem: Dog interface is defined twice

Solution: Share interface in monorepo via library

Normally sharing code between the backend and the frontend would have required days of work, but with Nx, it’s done in just minutes. 

In Nx, code is shared by creating libraries. 

Because everything is in a single repository, libraries can be imported without having to publish them to a registry.

Create a new library:

    ng g @nrwl/workspace:library data # This generates a barebone library with only Typescript setup

Next, move Dog into `libs/data/src/lib/data.ts`:

    export interface Dog {
      imageUrl: string;
    }

Update the frontend and the backend to import the interface from the library.

    import { Dog } from '@ts-fullstack-app/data';

After this refactor, the backend and the frontend will share the same definition of Ticket and never get out of sync. Being able to factor code into a lot of small libraries with a well-defined public API, which you can then use across both the backend and the frontend, is a key feature of Nx.

## Visualise dependency graph

    npm run dep-graph

## Add Swagger

The [OpenAPI](https://swagger.io/specification/) (Swagger) specification is a powerful definition format to describe RESTful APIs. Nest provides a dedicated [module](https://github.com/nestjs/swagger) to work with it.

    npm install --save @nestjs/swagger swagger-ui-express

Add swagger configuration to `main.ts` of api application:

```typescript
  // Add Swagger
  const options = new DocumentBuilder()
    .setTitle('Dogs API')
    .setDescription('The Dogs API description')
    .setVersion('1.0')
    .addTag('dogs')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/help', app, document);
```

Swagger docs are then available at `http://localhost:4200/api/help/`
