#!/bin/bash

# 检查是否输入了运行次数，默认为 5 次
RUN_COUNT=${1:-5}
SUCCESS_COUNT=0
FAILURE_COUNT=0

echo "开始执行断言准确性测试，共计 $RUN_COUNT 次..."
echo "------------------------------------------"

for ((i=1; i<=RUN_COUNT; i++))
do
    echo "[第 $i 次运行] 启动中..."
    
    # 执行测试命令
    npx tsx vip_center.ts
    
    # 检查上一个命令的退出码
    if [ $? -eq 0 ]; then
        echo "✅ 第 $i 次运行：断言成功"
        ((SUCCESS_COUNT++))
    else
        echo "❌ 第 $i 次运行：发生错误（断言失败或连接中断）"
        ((FAILURE_COUNT++))
    fi
    echo "------------------------------------------"
done

# 输出统计结果
echo "测试完成！"
echo "总计运行次数: $RUN_COUNT"
echo "成功次数 (SUCCESS): $SUCCESS_COUNT"
echo "失败次数 (FAILURE): $FAILURE_COUNT"

# 计算准确率
if [ $RUN_COUNT -gt 0 ]; then
    ACCURACY=$(echo "scale=2; $SUCCESS_COUNT * 100 / $RUN_COUNT" | bc)
    echo "断言准确率: $ACCURACY%"
fi

# 将结果写入 result.txt (追加模式)
{
    echo "测试时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "总计运行次数: $RUN_COUNT"
    echo "成功次数 (SUCCESS): $SUCCESS_COUNT"
    echo "失败次数 (FAILURE): $FAILURE_COUNT"
    if [ $RUN_COUNT -gt 0 ]; then
        echo "断言准确率: $ACCURACY%"
    fi
    echo "------------------------------------------"
} >> result.txt

echo "结果已追加至 [result.txt](result.txt)"
