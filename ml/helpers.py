def find(iterable, condition = lambda x: True):
  try:
    return next(x for x in iterable if condition(x))
  except StopIteration as e:
    return None
