import Benchmark from 'benchmark';

const BENCHMARK_SUITE_INS = new Benchmark.Suite();

// 注意：测试对象实例化或初始化放这里，或者

BENCHMARK_SUITE_INS.add('case 1', () => {
  // 测试用例 1
})
  .add('case 2', () => {
    // 测试用例 2
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .run({ async: true });
