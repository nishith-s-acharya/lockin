'use client';
/* eslint-disable react-hooks/static-components */
import * as React from 'react';
import { motion, isMotionComponent } from 'motion/react';
import { cn } from '@/lib/utils';

function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref).current = node;
      }
    });
  };
}

function mergeProps(childProps, slotProps) {
  const merged = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(childProps.className, slotProps.className);
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...(childProps.style),
      ...(slotProps.style),
    };
  }

  return merged;
}

const componentCache = new Map();

function getMotionComponent(type) {
  let comp = componentCache.get(type);
  if (!comp) {
    comp = motion.create(type);
    componentCache.set(type, comp);
  }
  return comp;
}

function Slot(
  {
    children,
    ref,
    ...props
  }
) {
  if (!React.isValidElement(children)) return null;

  const isAlreadyMotion =
    typeof children.type === 'object' &&
    children.type !== null &&
    isMotionComponent(children.type);

  const Base = isAlreadyMotion ? children.type : getMotionComponent(children.type);

  const { ref: childRef, ...childProps } = children.props;

  const mergedProps = mergeProps(childProps, props);

  return (<Base {...mergedProps} ref={mergeRefs(childRef, ref)} />);
}

export { Slot };
