'use client';

// Global safety net for React 18 DOM reconciliation mismatches caused by
// browser extensions (Google Translate, QuillBot, Grammarly, Chrome extensions)
// that modify text nodes or alter parent-child DOM hierarchies in React portals.
if (typeof window !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) {
      return child;
    }
    try {
      return originalRemoveChild.apply(this, arguments);
    } catch (error) {
      if (
        error instanceof DOMException &&
        (error.name === 'NotFoundError' || error.message?.includes('not a child'))
      ) {
        return child;
      }
      throw error;
    }
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    try {
      return originalInsertBefore.apply(this, arguments);
    } catch (error) {
      if (
        error instanceof DOMException &&
        (error.name === 'NotFoundError' || error.message?.includes('not a child'))
      ) {
        return newNode;
      }
      throw error;
    }
  };
}

export function DomSafetyPatch() {
  return null;
}
