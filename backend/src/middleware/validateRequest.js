export function validateRequest(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join('.') || source;
        errors[field] ??= issue.message;
      }

      return res.status(400).json({ errors });
    }

    req.validated ??= {};
    req.validated[source] = result.data;

    if (source === 'body' || source === 'params') {
      req[source] = result.data;
    }

    return next();
  };
}

export function parseRequest(schema, value) {
  return schema.safeParse(value);
}
