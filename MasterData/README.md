This directory keeps track of data from `kcsapi/api_start2` (a.k.a. master data) of game API.

Every `master-<XXX>.json` has two properties:

- `time` is a timestamp with the same meaning as result of `Number(new Date())`.
  When `<XXX>` is a number, the number should be idential to this number as well.

- `data` is `api_data` part of `kcsapi/api_start2`

And if `<XXX>` is not `init`. There should also be a file named `diff-<XXX>.json`,
which encodes the difference between master data changes.

The diff file has the following structure:

- `lhsTime` & `rhsTime`: the term `lhs` refers to the old master data,
  and `rhs` the newer one.

- `results`: diff result produced by [deep-diff](https://www.npmjs.com/package/deep-diff)
