Welcome to your new TanStack app! 

# Getting Started

Before running this application, at least locally, make sure you have a `.env` file defined with the following environment variables.

## Environment Variables

### Client-Side Variables (VITE_ prefix - Safe to Expose)

These variables are exposed to the client bundle and can be safely used in browser code:

```env
# Snowplow Collector URL for browser tracking
VITE_SNOWPLOW_COLLECTOR_URL=your-snowplow-cdi-collector-url

# Snowplow Signals endpoint (used for browser plugin)
VITE_SNOWPLOW_SIGNALS_ENDPOINT=your-signals-endpoint.svc.snplow.net
```

### Server-Side Variables (No VITE_ prefix - Private)

**⚠️ IMPORTANT:** These variables are **NOT** exposed to the client bundle and should be kept private. Use these for server-side API routes that require authentication.

```env
# Snowplow Signals endpoint (server-side, can also use VITE_ version as fallback)
SNOWPLOW_SIGNALS_ENDPOINT=your-signals-endpoint.svc.snplow.net

# API Key authentication (choose one: API Key mode OR Sandbox mode)
SNOWPLOW_SIGNALS_API_KEY=your-api-key
SNOWPLOW_SIGNALS_API_KEY_ID=your-api-key-id
SNOWPLOW_SIGNALS_ORG_ID=your-organization-id

# OR use Sandbox mode (alternative to API Key mode)
SNOWPLOW_SIGNALS_SANDBOX_TOKEN=your-sandbox-token
```

**Security Note:**
- Variables with `VITE_` prefix are bundled into the client code and visible to users
- Variables without `VITE_` prefix are only available server-side via `process.env`
- **Never** use `VITE_` prefix for API keys, tokens, or other sensitive credentials
- The server-side code supports both naming conventions for backward compatibility, but prefer non-`VITE_` versions for sensitive data

### Minimum Required Variables

For basic functionality, you need at minimum:

```env
VITE_SNOWPLOW_COLLECTOR_URL=your-snowplow-cdi-collector-url
VITE_SNOWPLOW_SIGNALS_ENDPOINT=your-signals-endpoint.svc.snplow.net
```

For API routes to work, you also need either:
- API Key mode: `SNOWPLOW_SIGNALS_ENDPOINT`, `SNOWPLOW_SIGNALS_API_KEY`, `SNOWPLOW_SIGNALS_API_KEY_ID`, `SNOWPLOW_SIGNALS_ORG_ID`
- OR Sandbox mode: `SNOWPLOW_SIGNALS_ENDPOINT`, `SNOWPLOW_SIGNALS_SANDBOX_TOKEN`

## Running the Application

To run this application locally:

```bash
npm install
npm run dev
```

The application will start on `http://localhost:3000` by default.

# Building For Production

To build this application for production:

```bash
npm run build
```

## Deployment

### Vercel Deployment

This application is configured to deploy on Vercel using TanStack Start with Nitro. The framework automatically handles:

- API routes (serverless functions)
- Client-side routing
- Server-side rendering

**Environment Variables in Vercel:**

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all the environment variables listed above
4. **Important:** For production, use the non-`VITE_` prefixed versions for sensitive credentials:
   - `SNOWPLOW_SIGNALS_API_KEY` (not `VITE_SNOWPLOW_SIGNALS_API_KEY`)
   - `SNOWPLOW_SIGNALS_API_KEY_ID` (not `VITE_SNOWPLOW_SIGNALS_API_KEY_ID`)
   - `SNOWPLOW_SIGNALS_ORG_ID` (not `VITE_SNOWPLOW_SIGNALS_ORG_ID`)

The endpoint `/api/service-attributes` will automatically be available as a serverless function. If you encounter issues, check that:
- Environment variables are set in Vercel project settings
- The API route returns proper error responses (check the response body for diagnostic information)

## Snowplow Integration

This application integrates with Snowplow for analytics and Signals for real-time interventions.

### Client-Side Tracking

The application uses `@snowplow/browser-tracker` for client-side event tracking. The tracker is initialized in `src/lib/snowplow.ts` and includes:
- Button click tracking
- Link click tracking
- Page view tracking
- Performance navigation timing
- Signals browser plugin for interventions

### Server-Side Signals API

The application uses `@snowplow/signals-node` for server-side Signals operations. This is used in API routes to:
- Fetch service attributes
- Perform authenticated Signals operations

**Security:** All sensitive credentials (API keys, tokens) are kept server-side only and never exposed to the client bundle.

### SnowplowSignalsContext

The `SnowplowSignalsContext` provides the Signals endpoint URL to client components. It only exposes the `baseUrl` (safe to expose), not sensitive credentials. For authenticated operations, use the API endpoints instead.

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting


This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```



## API Routes

This project uses TanStack Start's API route functionality. API routes are defined in `src/routes/api/` and automatically become serverless functions when deployed.

### Example API Route

API routes use the `server.handlers` configuration:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/example')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Server-side code - has access to process.env (private variables)
        return json({ message: 'Hello from API' })
      },
    },
  },
})
```

**Important:**
- API routes run server-side and have access to `process.env` (non-`VITE_` variables)
- Use `json()` from `@tanstack/react-start` to return JSON responses
- Error responses should include diagnostic information for debugging

### Available API Routes

- `/api/service-attributes` - Fetches Snowplow Signals service attributes
  - Query parameters: `attribute_key`, `identifier`, `name`
  - Returns diagnostic information if environment variables are missing

## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
npm install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
