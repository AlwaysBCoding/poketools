def find(iterable, condition = lambda x: True):
  try:
    return next(x for x in iterable if condition(x))
  except StopIteration as e:
    return None

def flatten(input_list):
  try:
    flattened_list = []
    for item in input_list:
      if(type(item) == list):
        for sub_item in item:
          flattened_list.append(sub_item)
      else:
        flattened_list.append(item)
    return flattened_list
  except Exception as e:
    return input_list
