'use client';

import * as React from 'react';
import {
  Code,
  CodeBlock,
  CodeHeader,
} from '@/components/animate-ui/components/animate/code';
import { FileCode2 } from 'lucide-react';

export const CodeDemo = ({
  duration = 7000,
  delay = 500,
  writing = true,
  cursor = true,
}) => {
  const [loopKey, setLoopKey] = React.useState(0);

  return (
    <Code
      key={`${duration}-${delay}-${writing}-${cursor}-${loopKey}`}
      className="w-full sm:w-100 h-120 border-none outline-none  "
      code={`'use client';
 
import * as React from 'react';
  
type MyComponentProps = {
  myProps: string;
} & React.ComponentProps<'div'>;
  
function MyComponent(props: MyComponentProps) {
  return (
    <div {...props}>
      <p>My Component</p>
    </div>
  );
}

export { MyComponent, type MyComponentProps };`}
    >
      <CodeHeader icon={FileCode2} copyButton>
       use-fetch.jsx
      </CodeHeader>

      <CodeBlock
        cursor={cursor}
        lang="jsx"
        writing={writing}
        duration={duration}
        delay={delay}
        onDone={() => setTimeout(() => setLoopKey(prev => prev + 1), 3000)}
      />
    </Code>
  );
};